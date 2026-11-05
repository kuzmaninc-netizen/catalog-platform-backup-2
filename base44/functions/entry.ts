import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const ADMIN_KEY = process.env.SUPER_ADMIN_KEY || 'catalog-owner-2026';
const SUBSCRIPTION_STATUSES = ['trial', 'pending', 'active', 'expired'];
const SUBSCRIPTION_PLANS = ['starter', 'pro'];
const TRIAL_DAYS = 7;

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isPastDate(value: unknown) {
  if (!value) return false;
  const date = new Date(`${String(value).slice(0, 10)}T23:59:59`);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() < Date.now();
}

function effectiveStatus(store: any) {
  const raw = store?.subscription_status;
  const status = SUBSCRIPTION_STATUSES.includes(raw) ? raw : 'trial';
  if (status === 'expired') return 'expired';
  if (isPastDate(store?.subscription_expires_at)) return 'expired';
  return status;
}

function isAdminRequest(body: any) {
  return String(body?.adminKey ?? '') === ADMIN_KEY;
}

const translit: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ѓ: 'gj', е: 'e', ж: 'zh', з: 'z',
  ѕ: 'dz', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', ќ: 'kj', у: 'u', ф: 'f', х: 'h',
  ц: 'c', ч: 'ch', џ: 'dj', ш: 'sh',
};

const clean = (value: unknown, max = 300) => String(value ?? '').trim().slice(0, max);

function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .split('')
    .map((char) => translit[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function asItems(result: any): any[] {
  if (Array.isArray(result)) return result;
  return Array.isArray(result?.items) ? result.items : [];
}

function publicStore(store: any) {
  if (!store) return null;
  const { access_key, owner_email, owner_user_id, ...rest } = store;
  return {
    ...rest,
    subscription_status: effectiveStatus(store),
    subscription_plan: SUBSCRIPTION_PLANS.includes(rest.subscription_plan) ? rest.subscription_plan : 'starter',
    subscription_expires_at: rest.subscription_expires_at || '',
  };
}

async function uniqueSlug(entities: any, base: string) {
  const root = base || 'prodavnica';
  let candidate = root;
  let attempt = 1;
  while (attempt < 40) {
    const found = asItems(await entities.Merchant.filter({ slug: candidate }, { limit: 1 }));
    if (found.length === 0) return candidate;
    attempt += 1;
    candidate = `${root}-${attempt}`;
  }
  return `${root}-${Date.now().toString().slice(-5)}`;
}

function phoneKey(value: unknown) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.length >= 8 ? digits.slice(-8) : digits;
}

async function currentUser(client: any) {
  try {
    const user = await client.auth.me();
    return user && user.id ? user : null;
  } catch {
    return null;
  }
}

async function storeForUser(entities: any, userId: string) {
  if (!userId) return null;
  const found = asItems(await entities.Merchant.filter({ owner_user_id: userId }, { limit: 1 }));
  return found[0] || null;
}

async function ensureCategory(entities: any, merchantId: string, name: string) {
  const categoryName = clean(name, 100);
  if (!categoryName) return { category_id: '', category_name: '' };
  const existing = asItems(
    await entities.Category.filter({ merchant_id: merchantId, name: categoryName }, { limit: 1 })
  );
  if (existing.length > 0) return { category_id: existing[0].id, category_name: categoryName };
  const created = await entities.Category.create({ merchant_id: merchantId, name: categoryName });
  return { category_id: created.id, category_name: categoryName };
}

async function storeCatalog(entities: any, store: any) {
  const [products, categories] = await Promise.all([
    entities.Product.filter({ merchant_id: store.id }, { sort: '-created_date', limit: 200 }),
    entities.Category.filter({ merchant_id: store.id }, { sort: 'created_date', limit: 100 }),
  ]);
  return {
    products: asItems(products),
    categories: asItems(categories),
  };
}

function storeFields(data: any) {
  return {
    business_name: clean(data?.business_name, 150),
    whatsapp_number: clean(data?.whatsapp_number, 30),
    viber_number: clean(data?.viber_number, 30),
    logo_url: clean(data?.logo_url, 1000),
    bio_text: clean(data?.bio_text, 500),
    city: clean(data?.city, 60),
    instagram: clean(data?.instagram, 120),
    facebook_url: clean(data?.facebook_url, 300),
  };
}

function productFields(data: any) {
  return {
    name: clean(data?.name, 200),
    description: clean(data?.description, 1200),
    price: Math.max(0, Number(data?.price) || 0),
    image_url: clean(data?.image_url, 1000),
    is_in_stock: data?.is_in_stock !== false,
    category_name: clean(data?.category_name, 100),
  };
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const entities = base44.asServiceRole.entities;
    const body = await req.json().catch(() => ({}));
    const action = clean(body?.action, 40);

    if (action === 'publicStore') {
      const slug = slugify(clean(body?.slug, 80));
      if (!slug) return Response.json({ error: 'Недостасува линк на продавницата.' }, { status: 400 });
      const found = asItems(await entities.Merchant.filter({ slug }, { limit: 1 }));
      if (found.length === 0) return Response.json({ store: null, products: [], categories: [] });
      if (effectiveStatus(found[0]) === 'expired') {
        return Response.json({
          blocked: true,
          store: {
            business_name: found[0].business_name,
            slug: found[0].slug,
            logo_url: found[0].logo_url || '',
          },
          products: [],
          categories: [],
        });
      }
      const catalog = await storeCatalog(entities, found[0]);
      return Response.json({ store: publicStore(found[0]), ...catalog });
    }

    if (action === 'createStore') {
      const user = await currentUser(base44);
      if (!user) {
        return Response.json({ error: 'Влези во твојот профил за да создадеш каталог.' }, { status: 401 });
      }
      const existing = await storeForUser(entities, user.id);
      if (existing) return Response.json({ store: publicStore(existing) });

      const fields = storeFields(body?.store);
      if (!fields.business_name) return Response.json({ error: 'Внеси име на бизнисот.' }, { status: 400 });
      if (!fields.whatsapp_number && !fields.viber_number) {
        return Response.json({ error: 'Внеси телефон за нарачки.' }, { status: 400 });
      }
      const requested = slugify(clean(body?.store?.slug, 60)) || slugify(fields.business_name);
      const slug = await uniqueSlug(entities, requested);
      const requestedPlan = SUBSCRIPTION_PLANS.includes(body?.plan)
        ? body.plan
        : SUBSCRIPTION_PLANS.includes(body?.store?.subscription_plan)
          ? body.store.subscription_plan
          : 'starter';
      const created = await entities.Merchant.create({
        ...fields,
        slug,
        owner_user_id: user.id,
        owner_email: clean(user.email, 200),
        owner_phone: phoneKey(fields.viber_number || fields.whatsapp_number || user.phone_key),
        subscription_status: 'trial',
        subscription_plan: requestedPlan,
        subscription_expires_at: addDays(TRIAL_DAYS),
      });
      return Response.json({ store: publicStore(created) });
    }

    if (action === 'myStore') {
      const user = await currentUser(base44);
      if (!user) return Response.json({ error: 'Влези во твојот профил.' }, { status: 401 });
      const store = await storeForUser(entities, user.id);
      if (!store) return Response.json({ store: null, products: [], categories: [] });
      const catalog = await storeCatalog(entities, store);
      return Response.json({ store: publicStore(store), ...catalog });
    }

    if (action === 'claimStore') {
      const user = await currentUser(base44);
      if (!user) return Response.json({ error: 'Влези во твојот профил.' }, { status: 401 });
      const existing = await storeForUser(entities, user.id);
      if (existing) return Response.json({ store: publicStore(existing) });

      const merchantId = clean(body?.merchantId, 60);
      const accessKey = clean(body?.accessKey, 80);
      if (!merchantId || !accessKey) return Response.json({ store: null });

      const store = await entities.Merchant.get(merchantId).catch((error: any) =>
        error?.status === 404 ? null : Promise.reject(error)
      );
      if (!store || !store.access_key || store.access_key !== accessKey) {
        return Response.json({ store: null });
      }

      const updated = await entities.Merchant.update(store.id, {
        owner_user_id: user.id,
        owner_email: clean(user.email, 200),
        owner_phone: store.owner_phone || phoneKey(store.viber_number || store.whatsapp_number),
      });
      return Response.json({ store: publicStore(updated) });
    }

    if (action === 'loginEmail') {
      const identifier = clean(body?.identifier, 160);
      if (identifier.includes('@')) return Response.json({ email: identifier.toLowerCase() });
      const key = phoneKey(identifier);
      if (key.length < 6) return Response.json({ email: '' });
      const merchants = asItems(await entities.Merchant.filter({ owner_phone: key }, { limit: 1 }));
      if (merchants[0]?.owner_email) return Response.json({ email: merchants[0].owner_email });
      return Response.json({ email: '' });
    }

    if (action === 'updateStore') {
      const user = await currentUser(base44);
      const store = user ? await storeForUser(entities, user.id) : null;
      if (!store) return Response.json({ error: 'Продавницата не е пронајдена.' }, { status: 403 });
      const fields = storeFields(body?.store);
      if (!fields.business_name) return Response.json({ error: 'Внеси име на бизнисот.' }, { status: 400 });
      const updated = await entities.Merchant.update(store.id, fields);
      return Response.json({ store: publicStore(updated) });
    }

    if (action === 'createProduct' || action === 'updateProduct') {
      const user = await currentUser(base44);
      const store = user ? await storeForUser(entities, user.id) : null;
      if (!store) return Response.json({ error: 'Продавницата не е пронајдена.' }, { status: 403 });
      const fields = productFields(body?.product);
      if (!fields.name) return Response.json({ error: 'Внеси име на производот.' }, { status: 400 });
      if (fields.price <= 0) return Response.json({ error: 'Внеси цена поголема од 0.' }, { status: 400 });
      const category = await ensureCategory(entities, store.id, fields.category_name);
      const payload = { ...fields, category_id: category.category_id, category_name: category.category_name };

      if (action === 'createProduct') {
        const created = await entities.Product.create({ ...payload, merchant_id: store.id });
        return Response.json({ product: created });
      }

      const productId = clean(body?.productId, 60);
      const existing = await entities.Product.get(productId).catch((error: any) =>
        error?.status === 404 ? null : Promise.reject(error)
      );
      if (!existing || existing.merchant_id !== store.id) {
        return Response.json({ error: 'Производот не е пронајден.' }, { status: 404 });
      }
      const updated = await entities.Product.update(productId, payload);
      return Response.json({ product: updated });
    }

    if (action === 'deleteProduct') {
      const user = await currentUser(base44);
      const store = user ? await storeForUser(entities, user.id) : null;
      if (!store) return Response.json({ error: 'Продавницата не е пронајдена.' }, { status: 403 });
      const productId = clean(body?.productId, 60);
      const existing = await entities.Product.get(productId).catch((error: any) =>
        error?.status === 404 ? null : Promise.reject(error)
      );
      if (!existing || existing.merchant_id !== store.id) {
        return Response.json({ error: 'Производот не е пронајден.' }, { status: 404 });
      }
      await entities.Product.delete(productId);
      return Response.json({ ok: true });
    }

    if (action === 'createSubscriptionRequest') {
      const user = await currentUser(base44);
      const store = user ? await storeForUser(entities, user.id) : null;
      if (!store) return Response.json({ error: 'Продавницата не е пронајдена.' }, { status: 403 });
      const phone = clean(body?.phone, 30) || clean(store.whatsapp_number, 30);
      if (!phone) return Response.json({ error: 'Внеси телефон за контакт.' }, { status: 400 });
      const created = await entities.SubscriptionRequest.create({
        merchant_id: store.id,
        business_name: store.business_name,
        slug: store.slug,
        phone,
        plan_requested: SUBSCRIPTION_PLANS.includes(body?.plan) ? body.plan : 'starter',
        message: clean(body?.message, 1000),
        status: 'new',
      });
      return Response.json({ request: created });
    }

    if (action === 'adminLogin') {
      if (!isAdminRequest(body)) return Response.json({ error: 'Погрешен пристапен клуч.' }, { status: 401 });
      return Response.json({ ok: true });
    }

    if (action === 'adminOverview') {
      if (!isAdminRequest(body)) return Response.json({ error: 'Погрешен пристапен клуч.' }, { status: 401 });
      const [merchants, requests] = await Promise.all([
        entities.Merchant.list({ sort: '-created_date', limit: 300 }),
        entities.SubscriptionRequest.filter({ status: 'new' }, { sort: '-created_date', limit: 100 }),
      ]);
      return Response.json({
        merchants: asItems(merchants).map(publicStore),
        requests: asItems(requests),
      });
    }

    if (action === 'adminUpdateSubscription') {
      if (!isAdminRequest(body)) return Response.json({ error: 'Погрешен пристапен клуч.' }, { status: 401 });
      const merchantId = clean(body?.merchantId, 60);
      const store = await entities.Merchant.get(merchantId).catch((error: any) =>
        error?.status === 404 ? null : Promise.reject(error)
      );
      if (!store) return Response.json({ error: 'Продавницата не е пронајдена.' }, { status: 404 });

      const status = clean(body?.subscription_status, 20);
      const plan = clean(body?.subscription_plan, 20);
      const expiresAt = clean(body?.subscription_expires_at, 30);
      if (status && !SUBSCRIPTION_STATUSES.includes(status)) {
        return Response.json({ error: 'Невалиден статус.' }, { status: 400 });
      }
      if (plan && !SUBSCRIPTION_PLANS.includes(plan)) {
        return Response.json({ error: 'Невалиден план.' }, { status: 400 });
      }
      if (expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
        return Response.json({ error: 'Невалиден датум.' }, { status: 400 });
      }

      const patch: Record<string, string> = {};
      if (status) patch.subscription_status = status;
      if (plan) patch.subscription_plan = plan;
      if (body?.subscription_expires_at !== undefined) patch.subscription_expires_at = expiresAt;

      const updated = await entities.Merchant.update(merchantId, patch);
      return Response.json({ merchant: publicStore(updated) });
    }

    if (action === 'adminResolveRequest') {
      if (!isAdminRequest(body)) return Response.json({ error: 'Погрешен пристапен клуч.' }, { status: 401 });
      const requestId = clean(body?.requestId, 60);
      if (!requestId) return Response.json({ error: 'Недостасува барање.' }, { status: 400 });
      const updated = await entities.SubscriptionRequest.update(requestId, { status: 'done' });
      return Response.json({ request: updated });
    }

    return Response.json({ error: 'Непознато барање.' }, { status: 400 });
  } catch (error: any) {
    return Response.json({ error: error?.message || 'Настана грешка.' }, { status: 500 });
  }
}
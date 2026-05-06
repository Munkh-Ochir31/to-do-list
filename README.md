# Хөнжүүлэх систем — Даалгаврын модуль

Next.js + Supabase дээр хийсэн laundry task management module.

## Setup

### 1. Supabase холболт

`.env.local.example`-г хуулж `.env.local` болгоод Supabase project-ийн утгыг бөглөнө:

```bash
cp .env.local.example .env.local
```

`.env.local` дотор:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

Supabase Dashboard → Project Settings → API хэсгээс эдгээр утгыг авна.

### 2. Хүснэгт үүсгэх

Supabase Dashboard → SQL Editor → New query руу очоод `supabase/schema.sql` файлын агуулгыг бүхэлд нь copy/paste хийж run хийнэ. Энэ нь:

- `tasks` болон `statuses` хүснэгтийг үүсгэнэ
- 5 анхдагч статусыг seed хийнэ
- Public нээлттэй RLS бодлогыг тохируулна

### 3. Локал-аар ажиллуулах

```bash
npm install
npm run dev
```

`http://localhost:3000` дээр нээнэ.

## Боломжууд

- ➕ Даалгавар нэмэх / засах / устгах
- ✅ Статус солих (dropdown эсвэл checkbox)
- 🎨 Өөрийн статус нэмэх (Статус удирдах модалаар)
- 🔍 Хайх / шүүх / эрэмбэлэх
- 📊 Явцын статистик
- 🎞️ Анимация: pulse dot, slide-in, check pop

## Архитектур

- `app/page.tsx` — гол хуудас
- `app/components/` — UI компонентууд
- `app/lib/supabase.ts` — Supabase client
- `app/lib/data.ts` — өгөгдлийн query функцууд
- `app/types.ts` — TypeScript types
- `app/constants.ts` — анхдагч утгууд (статус, ангилал, т.г.)
- `supabase/schema.sql` — DB schema

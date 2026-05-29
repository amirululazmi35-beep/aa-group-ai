import bcrypt from 'bcryptjs';
import { db } from './index';
import { settings, users, categories, products } from './schema';

async function main() {
  console.log('⏳ Memulakan proses seeding database...');

  const now = Date.now();

  try {
    // 1. Seed Settings (jika belum ada)
    const brandSettingsId = 'default-settings';
    await db.insert(settings).values({
      id: brandSettingsId,
      brandName: 'AA AI GROUP',
      logoUrl: '/logo.png',
      supportEmail: 'support@aa-aigroup.com',
      supportPhone: '+601118715341',
      themeColor: '#6366f1',
      qrUrl: '/qr.jpg',
      whatsappNumber: '601118715341',
      maintenanceMode: false,
      maintenanceMessage: 'Website sedang dinaik taraf. Hubungi kami di WhatsApp untuk tempahan langsung.',
      updatedAt: now,
    }).onConflictDoNothing();
    console.log('✅ Settings seeded.');

    // 2. Seed Admin User (jika belum ada)
    const adminEmail = 'admin@aa-aigroup.com';
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await db.insert(users).values({
      id: 'admin-user-id-001',
      name: 'AA Admin',
      email: adminEmail,
      passwordHash: passwordHash,
      role: 'admin',
      phone: '+601118715341',
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
    console.log('✅ Admin user seeded (admin@aa-aigroup.com / admin123).');

    // 3. Seed Categories
    const categoryList = [
      {
        id: 'cat-app-premium',
        name: 'App Premium',
        slug: 'app-premium',
        description: 'Lesen aplikasi premium stabil dengan waranti penuh.',
        isActive: true,
        createdAt: now,
      },
      {
        id: 'cat-video-education',
        name: 'Video Education AI',
        slug: 'video-education-ai',
        description: 'Modul video tutorial dan panduan kecerdasan buatan (AI) termaju.',
        isActive: true,
        createdAt: now,
      },
      {
        id: 'cat-servis-digital',
        name: 'Servis Digital',
        slug: 'servis-digital',
        description: 'Servis reka bentuk, pembangunan web, dan automasi digital profesional.',
        isActive: true,
        createdAt: now,
      }
    ];

    for (const cat of categoryList) {
      await db.insert(categories).values(cat).onConflictDoNothing();
    }
    console.log('✅ Kategori seeded.');

    // 4. Seed Products
    const productList = [
      {
        id: 'prod-canva-pro',
        categoryId: 'cat-app-premium',
        name: 'Canva Pro - 999 Hari (Lifetime)',
        slug: 'canva-pro-lifetime',
        type: 'app' as const,
        shortDescription: 'Akses penuh Canva Pro premium.',
        description: 'Canva Pro Premium dengan tempoh 999 Hari (akses seumur hidup). Bebaskan kreativiti anda dengan templat premium, buang latar belakang gambar dengan satu klik, muat turun PNG lutsinar, dan storan awan tanpa had. Dijamin stabil dengan waranti penuh.',
        price: 50.00,
        comparePrice: 120.00,
        thumbnailUrl: '/images/canva.png',
        status: 'published' as const,
        accessType: 'license_key' as const,
        accessValue: 'CANVA-PRO-EDU-LIFETIME-ACCESS-GRANTED',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-capcut-pro',
        categoryId: 'cat-app-premium',
        name: 'CapCut Pro Premium - 3 Bulan',
        slug: 'capcut-pro-3-bulan',
        type: 'app' as const,
        shortDescription: 'Akses penuh ciri pro penyunting video CapCut.',
        description: 'CapCut Pro Premium 3 Bulan. Eksport video tanpa tera air (watermark), gunakan templat VIP, kesan visual neon premium, render kelajuan tinggi, dan storan cloud. Sesuai untuk PC dan telefon pintar.',
        price: 40.00,
        comparePrice: 90.00,
        thumbnailUrl: '/images/capcut.png',
        status: 'published' as const,
        accessType: 'license_key' as const,
        accessValue: 'CAPCUT-PRO-3MONTH-ACTIVATION-KEY-XYZ',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-chatgpt-mastery',
        categoryId: 'cat-video-education',
        name: 'ChatGPT & Prompt Engineering Mastery',
        slug: 'chatgpt-prompt-mastery',
        type: 'video_course' as const,
        shortDescription: 'Belajar cara menulis prompt kecerdasan buatan bertaraf dunia.',
        description: 'Kuasai model bahasa AI termaju (ChatGPT, Gemini, Claude) untuk meningkatkan produktiviti dan automasi perniagaan anda. Kursus video ini merangkumi teknik penulisan prompt kustom, membina agen AI, dan rahsia menjana pendapatan sampingan.',
        price: 29.00,
        comparePrice: 79.00,
        thumbnailUrl: '/images/ai-course.png',
        status: 'published' as const,
        accessType: 'video_access' as const,
        accessValue: 'Akses Penuh Pembelajaran Video AI Diberikan',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'prod-custom-web',
        categoryId: 'cat-servis-digital',
        name: 'Servis Bina Website Landing Page Premium',
        slug: 'servis-landing-page',
        type: 'service' as const,
        shortDescription: 'Pembangunan halaman landing page premium responsif.',
        description: 'Bina landing page futuristik, laju, dan mesra peranti mudah alih khas untuk perniagaan atau produk anda. Pakej termasuk reka bentuk antaramuka eksklusif, borang tempahan bersepadu, dan integrasi WhatsApp pesanan.',
        price: 250.00,
        comparePrice: 500.00,
        thumbnailUrl: '/images/service-web.png',
        status: 'published' as const,
        accessType: 'service_request' as const,
        accessValue: 'Sila isi borang keperluan servis digital anda di tab dashboard selepas tempahan.',
        createdAt: now,
        updatedAt: now,
      }
    ];

    for (const prod of productList) {
      await db.insert(products).values(prod).onConflictDoNothing();
    }
    console.log('✅ Produk seeded.');
    console.log('🎉 Seeding selesai dengan jaya!');
  } catch (error) {
    console.error('❌ Ralat semasa seeding:', error);
  }
}

main();

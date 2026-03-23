// Seed FAQ items — run once: node seed-faq.js
// Safe to re-run: skips if FAQ items already exist.

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const faqItems = [
  {
    question: 'What is NLP and why do I need it?',
    question_ru: 'Что такое НЛП и зачем оно мне?',
    answer: 'It is a set of practical techniques that help you manage your thinking, state, and behavior, improve communication, and achieve your goals faster.',
    answer_ru: 'Это набор практических техник, которые помогают управлять мышлением, состоянием и поведением, улучшать коммуникацию и быстрее достигать целей.',
    order: 1
  },
  {
    question: 'What results will I get?',
    question_ru: 'Какие результаты я получу?',
    answer: 'You will learn to better understand people, communicate confidently, manage emotions, and achieve desired results in life and work faster.',
    answer_ru: 'Вы научитесь лучше понимать людей, уверенно общаться, управлять эмоциями и быстрее достигать желаемых результатов в жизни и работе.',
    order: 2
  },
  {
    question: 'Is it suitable for me if I have no experience?',
    question_ru: 'Подойдёт ли мне, если у меня нет опыта?',
    answer: 'Yes, the program is suitable for beginners. Everything is explained in simple language and immediately applied in practice.',
    answer_ru: 'Да, программа подходит для начинающих. Всё объясняется простым языком и сразу применяется на практике.',
    order: 3
  },
  {
    question: 'Is it theory or practice?',
    question_ru: 'Это теория или практика?',
    answer: 'The main focus is on practice. You immediately apply the techniques in real life.',
    answer_ru: 'Основной упор сделан на практику. Вы сразу применяете техники в реальной жизни.',
    order: 4
  },
  {
    question: 'When will I see results?',
    question_ru: 'Когда я увижу результат?',
    answer: 'The first changes are noticeable during the training process, and sustained results are formed with regular practice.',
    answer_ru: 'Первые изменения заметны уже в процессе обучения, а устойчивый результат формируется при регулярной практике.',
    order: 5
  }
];

async function seedFaq() {
  try {
    const existing = await prisma.content.count({ where: { type: 'faq' } });
    if (existing > 0) {
      console.log(`FAQ already has ${existing} items. Skipping seed. Delete them first to re-seed.`);
      return;
    }

    for (const item of faqItems) {
      const { order, ...data } = item;
      await prisma.content.create({
        data: { type: 'faq', data, sortOrder: order }
      });
    }

    console.log(`Seeded ${faqItems.length} FAQ items.`);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedFaq();

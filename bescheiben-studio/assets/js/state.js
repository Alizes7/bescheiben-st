'use strict';

/** @type {SlideData[]} */
const slides = [
  {
    type: 'cover',
    tag: 'MARKETING DIGITAL',
    headline: 'Sua marca merece ser lembrada.',
    headlineHighlight: 'lembrada.',
    sub: 'Descubra como transformamos presença digital em resultados concretos para negócios B2B.',
    cta: 'Arraste e veja',
    showCta: true,
    brand: 'BESCHEIBEN',
  },
  {
    type: 'content',
    step: 'PASSO 01',
    headline: 'O problema que ninguém fala',
    headlineHighlight: 'ninguém fala',
    body: 'A maioria das empresas B2B investe em produto, mas esquece de investir em como esse produto é percebido. Branding não é luxo — é sobrevivência no mercado digital.',
    brand: 'BESCHEIBEN',
  },
  {
    type: 'content',
    step: 'PASSO 02',
    headline: 'Presença que converte',
    headlineHighlight: 'converte',
    body: 'Uma estratégia bem posicionada no Instagram gera leads qualificados, fortalece autoridade e reduz o ciclo de vendas. Isso é o que a Bescheiben entrega.',
    brand: 'BESCHEIBEN',
  },
  {
    type: 'quote',
    quote: 'Empresas que dominam o digital hoje colhem os contratos de amanhã.',
    quoteHighlight: 'contratos de amanhã.',
    author: 'Bescheiben Digital Agency',
  },
  {
    type: 'cta',
    eyebrow: 'VAMOS CONSTRUIR JUNTOS',
    headline: 'Pronto para crescer?',
    headlineHighlight: 'crescer?',
    body: 'Fale com nosso time e descubra como a Bescheiben pode transformar sua presença digital.',
    cta: 'Falar com especialista',
    ctaIcon: '→',
  },
];

/** Index of the currently active slide */
let currentSlide = 0;

const base = import.meta.env.BASE_URL

// Replace the titles and notes with your own words, one entry per photo.
export const memories = [
  { src: `${base}photos/1.jpg`, title: 'forever', note: 'my forever love.' },
  { src: `${base}photos/2.jpg`, title: 'That baech day', note: 'look how cute you are.' },
  { src: `${base}photos/3.jpg`, title: 'My favourite smile', note: 'smile i want to see forever.' },
  { src: `${base}photos/4.jpg`, title: 'Together', note: 'love you soo much' },
  { src: `${base}photos/5.jpg`, title: 'Just us', note: 'always together.' },
  { src: `${base}photos/6.jpg`, title: 'Always', note: 'whatever happens,im with you.' },
]

// Where each polaroid starts (left %, top %, tilt in degrees). Up to 8 are used.
export const slots = [
  { l: 5, t: 17, r: -7 },
  { l: 28, t: 40, r: 5 },
  { l: 52, t: 18, r: -4 },
  { l: 70, t: 42, r: 6 },
  { l: 12, t: 56, r: 4 },
  { l: 40, t: 62, r: -6 },
  { l: 64, t: 62, r: 3 },
  { l: 70, t: 16, r: 7 },
]
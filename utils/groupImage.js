export const groupImages = [
  '/images/group1.jpg',
  '/images/group2.jpg',
  '/images/group3.jpg',
  '/images/group4.jpg',
  '/images/group5.jpg',
  '/images/group6.jpg'
]

export default function getGroupImage (imageUrl) {
  if (groupImages.includes(imageUrl)) return imageUrl
  if (
    imageUrl &&
    (imageUrl.startsWith('/') || /^https?:\/\//.test(imageUrl))
  ) {
    return imageUrl
  }
  return groupImages[0]
}

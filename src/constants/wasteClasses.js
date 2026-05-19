/**
 * Waste detection classes — 6 classes trained in YOLOv8.
 * Order MUST match model training class indices.
 */
export const WASTE_CLASSES = {
  biodegradable: {
    id: 0,
    name: 'Biodegradable',
    nameId: 'Organik',
    color: '#4ade80',         // Green
    bgColor: 'bg-green-400',
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
    icon: '🍃',
    description: 'Sampah organik yang dapat terurai secara alami',
    tips: 'Komposkan sisa makanan, daun, dan sampah organik lainnya.',
  },
  cardboard: {
    id: 1,
    name: 'Cardboard',
    nameId: 'Kardus',
    color: '#f59e0b',         // Amber
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500',
    icon: '📦',
    description: 'Kardus dan karton tebal',
    tips: 'Lipat kardus agar hemat tempat. Pastikan kering sebelum didaur ulang.',
  },
  glass: {
    id: 2,
    name: 'Glass',
    nameId: 'Kaca',
    color: '#06b6d4',         // Cyan
    bgColor: 'bg-cyan-500',
    textColor: 'text-cyan-500',
    borderColor: 'border-cyan-500',
    icon: '🫙',
    description: 'Botol kaca, toples, dan pecahan kaca',
    tips: 'Cuci bersih dan pisahkan tutupnya. Hati-hati dengan pecahan kaca.',
  },
  metal: {
    id: 3,
    name: 'Metal',
    nameId: 'Logam',
    color: '#a1a1aa',         // Zinc/Gray
    bgColor: 'bg-zinc-400',
    textColor: 'text-zinc-400',
    borderColor: 'border-zinc-400',
    icon: '🥫',
    description: 'Kaleng, aluminium, dan logam lainnya',
    tips: 'Cuci bersih kaleng bekas. Aluminium sangat bernilai untuk daur ulang.',
  },
  paper: {
    id: 4,
    name: 'Paper',
    nameId: 'Kertas',
    color: '#e879f9',         // Fuchsia
    bgColor: 'bg-fuchsia-400',
    textColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-400',
    icon: '📄',
    description: 'Kertas, koran, majalah, dan tisu',
    tips: 'Jangan campurkan kertas basah/berminyak. Pisahkan dari sampah lain.',
  },
  plastic: {
    id: 5,
    name: 'Plastic',
    nameId: 'Plastik',
    color: '#f43f5e',         // Rose/Red
    bgColor: 'bg-rose-500',
    textColor: 'text-rose-500',
    borderColor: 'border-rose-500',
    icon: '🧴',
    description: 'Botol plastik, kemasan, dan plastik lainnya',
    tips: 'Kurangi penggunaan plastik sekali pakai. Pilah berdasarkan kode daur ulang.',
  },
};

/**
 * Class names array — index matches model class ID.
 */
export const CLASS_NAMES = [
  'BIODEGRADABLE',
  'CARDBOARD',
  'GLASS',
  'METAL',
  'PAPER',
  'PLASTIC',
];

/**
 * Get class config by class_name from model output.
 */
export function getClassConfig(className) {
  const key = className?.toLowerCase();
  return WASTE_CLASSES[key] || {
    id: -1,
    name: className || 'Unknown',
    nameId: className || 'Tidak dikenal',
    color: '#00ff6a',
    icon: '❓',
    description: 'Kelas tidak dikenal',
    tips: '',
  };
}

/**
 * Get color for a class by ID (for canvas drawing).
 */
export function getClassColor(classId) {
  const entry = Object.values(WASTE_CLASSES).find(c => c.id === classId);
  return entry?.color || '#00ff6a';
}

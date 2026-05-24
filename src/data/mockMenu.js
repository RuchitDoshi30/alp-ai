// Food & Drink data
export const STANDS = [
  {
    id: 's1',
    name: 'Spice Bowl',
    icon: '🍛',
    category: 'Indian',
    location: 'Level 2, Block A',
    baseWait: 8,
    items: [
      { id: 'i1', name: 'Vada Pav', desc: 'Classic Mumbai street style', price: 80, emoji: '🍔', veg: true },
      { id: 'i2', name: 'Pav Bhaji', desc: 'Spiced mixed vegetables', price: 120, emoji: '🥘', veg: true },
      { id: 'i3', name: 'Samosa (2pc)', desc: 'Crispy fried pastry', price: 60, emoji: '🥟', veg: true },
      { id: 'i4', name: 'Biryani Box', desc: 'Aromatic basmati rice', price: 180, emoji: '🍚', veg: false },
    ],
  },
  {
    id: 's2',
    name: 'Grill Zone',
    icon: '🍗',
    category: 'Grills',
    location: 'Level 1, Block C',
    baseWait: 14,
    items: [
      { id: 'i5', name: 'Chicken Tikka', desc: 'Marinated grilled chicken', price: 220, emoji: '🍖', veg: false },
      { id: 'i6', name: 'Seekh Kebab', desc: 'Minced meat on skewer', price: 180, emoji: '🥙', veg: false },
      { id: 'i7', name: 'Paneer Tikka', desc: 'Grilled cottage cheese', price: 160, emoji: '🧀', veg: true },
      { id: 'i8', name: 'Corn on the Cob', desc: 'Butter & masala', price: 80, emoji: '🌽', veg: true },
    ],
  },
  {
    id: 's3',
    name: 'Sip & Go',
    icon: '🥤',
    category: 'Drinks',
    location: 'Level 1, Block B',
    baseWait: 4,
    items: [
      { id: 'i9', name: 'Cold Coffee', desc: 'Chilled espresso blend', price: 120, emoji: '☕', veg: true },
      { id: 'i10', name: 'Fresh Lime Soda', desc: 'Sweet / Salt', price: 80, emoji: '🍋', veg: true },
      { id: 'i11', name: 'Energy Drink', desc: 'Boost + electrolytes', price: 150, emoji: '⚡', veg: true },
      { id: 'i12', name: 'Mango Lassi', desc: 'Thick chilled yogurt', price: 100, emoji: '🥭', veg: true },
    ],
  },
  {
    id: 's4',
    name: 'Snack Shack',
    icon: '🍿',
    category: 'Snacks',
    location: 'Level 3, Block D',
    baseWait: 6,
    items: [
      { id: 'i13', name: 'Popcorn (Large)', desc: 'Butter / Masala / Caramel', price: 120, emoji: '🍿', veg: true },
      { id: 'i14', name: 'Nachos + Dip', desc: 'Salsa & cheese dip', price: 150, emoji: '🌮', veg: true },
      { id: 'i15', name: 'French Fries', desc: 'Crispy with seasoning', price: 100, emoji: '🍟', veg: true },
      { id: 'i16', name: 'Chocolate Brownie', desc: 'Warm fudge brownie', price: 90, emoji: '🍫', veg: true },
    ],
  },
  {
    id: 's5',
    name: 'Burger Republic',
    icon: '🍔',
    category: 'Fast Food',
    location: 'Level 2, Block E',
    baseWait: 18,
    items: [
      { id: 'i17', name: 'Veggie Burger', desc: 'Aloo tikki patty', price: 130, emoji: '🥦', veg: true },
      { id: 'i18', name: 'Chicken Burger', desc: 'Crispy fried chicken', price: 180, emoji: '🍔', veg: false },
      { id: 'i19', name: 'Pizza Slice', desc: '4-cheese margherita', price: 140, emoji: '🍕', veg: true },
      { id: 'i20', name: 'Hot Dog', desc: 'With mustard & relish', price: 150, emoji: '🌭', veg: false },
    ],
  },
  {
    id: 's6',
    name: 'Ice Cream Stop',
    icon: '🍦',
    category: 'Desserts',
    location: 'Level 3, Block A',
    baseWait: 3,
    items: [
      { id: 'i21', name: 'Kulfi on Stick', desc: 'Traditional Indian ice cream', price: 80, emoji: '🍧', veg: true },
      { id: 'i22', name: 'Sundae Cup', desc: 'Vanilla + chocolate sauce', price: 120, emoji: '🍨', veg: true },
      { id: 'i23', name: 'Chocobar', desc: 'Dark chocolate coated', price: 70, emoji: '🍫', veg: true },
      { id: 'i24', name: 'Fruit Bowl', desc: 'Fresh seasonal fruits', price: 100, emoji: '🍓', veg: true },
    ],
  },
];

export const FOOD_CATEGORIES = ['All', 'Indian', 'Grills', 'Drinks', 'Snacks', 'Fast Food', 'Desserts'];

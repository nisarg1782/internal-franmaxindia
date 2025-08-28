const brands = [
  {
    id: "1",
    name: "SkinGlow",
    category: "Retail",
    investment: "₹30L - 50L",
    area: "300 - 500 sq.ft",
    outlets: "100+",
    image: "https://www.thethrive.in/wp-content/uploads/2022/03/All-You-Need-To-Know-About-Brand-Image.jpg.webp"
  },
  {
    id: "2",
    name: "BeautyPlus",
    category: "Food and Beverage",
    investment: "₹20L - 30L",
    area: "200 - 300 sq.ft",
    outlets: "20-50",
    image: "https://payu.in/blog/wp-content/uploads/2017/03/Brand-building-process-.gif"
  },
  {
    id: "3",
    name: "Aliff Overseas",
    category: "Education",
    investment: "₹50L - 1Cr",
    area: "200 - 300 sq.ft",
    outlets: "20-50",
    image: "https://cdn.pixabay.com/photo/2016/11/29/04/17/brand-1868724_1280.jpg"
  },
  {
    id: "4",
    name: "FitFlex Gym",
    category: "Health & Fitness",
    investment: "₹10L - 20L",
    area: "500 - 1000 sq.ft",
    outlets: "10-20",
    image: "https://source.unsplash.com/800x600/?gym,fitness"
  },
  {
    id: "5",
    name: "TechWorld",
    category: "Electronics",
    investment: "₹1Cr - 2Cr",
    area: "800 - 1000 sq.ft",
    outlets: "100+",
    image: "https://source.unsplash.com/800x600/?electronics,store"
  },
  {
    id: "6",
    name: "EduSpark",
    category: "Education",
    investment: "₹5L - 10L",
    area: "300 - 600 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?education"
  },
  {
    id: "7",
    name: "ChocoBlast",
    category: "Food and Beverage",
    investment: "₹15L - 25L",
    area: "200 - 400 sq.ft",
    outlets: "50-100",
    image: "https://source.unsplash.com/800x600/?chocolate"
  },
  {
    id: "8",
    name: "GreenScape",
    category: "Agriculture",
    investment: "₹10L - 15L",
    area: "1000 - 1500 sq.ft",
    outlets: "Less than 10",
    image: "https://source.unsplash.com/800x600/?farm"
  },
  {
    id: "9",
    name: "PizzaHut",
    category: "Food and Beverage",
    investment: "₹50L - 1Cr",
    area: "800 - 1200 sq.ft",
    outlets: "100+",
    image: "https://source.unsplash.com/800x600/?pizza,restaurant"
  },
  {
    id: "10",
    name: "SmartCare",
    category: "Healthcare",
    investment: "₹20L - 30L",
    area: "400 - 800 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?clinic"
  },
  {
    id: "11",
    name: "EcoRide",
    category: "Automotive",
    investment: "₹1Cr - 2Cr",
    area: "1500 - 2000 sq.ft",
    outlets: "10-20",
    image: "https://source.unsplash.com/800x600/?car,electric"
  },
  {
    id: "12",
    name: "PrintoPro",
    category: "Printing",
    investment: "₹5L - 10L",
    area: "300 - 500 sq.ft",
    outlets: "Less than 10",
    image: "https://source.unsplash.com/800x600/?printer"
  },
  {
    id: "13",
    name: "CafeBrew",
    category: "Cafe",
    investment: "₹20L - 30L",
    area: "400 - 700 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?coffee,cafe"
  },
  {
    id: "14",
    name: "TrendyStyle",
    category: "Fashion",
    investment: "₹25L - 40L",
    area: "500 - 1000 sq.ft",
    outlets: "50-100",
    image: "https://source.unsplash.com/800x600/?fashion,store"
  },
  {
    id: "15",
    name: "PackitUp",
    category: "Logistics",
    investment: "₹10L - 20L",
    area: "800 - 1500 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?delivery"
  },
  {
    id: "16",
    name: "DentEase",
    category: "Healthcare",
    investment: "₹10L - 15L",
    area: "300 - 500 sq.ft",
    outlets: "10-20",
    image: "https://source.unsplash.com/800x600/?dental"
  },
  {
    id: "17",
    name: "KidsHub",
    category: "Toys & Games",
    investment: "₹15L - 25L",
    area: "400 - 800 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?toys,store"
  },
  {
    id: "18",
    name: "BookNest",
    category: "Bookstore",
    investment: "₹5L - 10L",
    area: "300 - 500 sq.ft",
    outlets: "10-20",
    image: "https://source.unsplash.com/800x600/?books"
  },
  {
    id: "19",
    name: "PetPalace",
    category: "Pets & Care",
    investment: "₹20L - 30L",
    area: "500 - 900 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?pets"
  },
  {
    id: "20",
    name: "TechyBits",
    category: "Electronics",
    investment: "₹30L - 50L",
    area: "600 - 1000 sq.ft",
    outlets: "50-100",
    image: "https://source.unsplash.com/800x600/?gadgets"
  },
  {
    id: "21",
    name: "MilkMore",
    category: "Dairy",
    investment: "₹10L - 20L",
    area: "200 - 400 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?milk,dairy"
  },
  {
    id: "22",
    name: "HealthHive",
    category: "Healthcare",
    investment: "₹50L - 1Cr",
    area: "700 - 1200 sq.ft",
    outlets: "50-100",
    image: "https://source.unsplash.com/800x600/?health"
  },
  {
    id: "23",
    name: "GameBase",
    category: "Entertainment",
    investment: "₹30L - 40L",
    area: "500 - 800 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?gaming"
  },
  {
    id: "24",
    name: "FurnitureCo",
    category: "Furniture",
    investment: "₹1Cr+",
    area: "1500 - 3000 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?furniture"
  },
  {
    id: "25",
    name: "JewelsPark",
    category: "Jewellery",
    investment: "₹2Cr - 5Cr",
    area: "600 - 1000 sq.ft",
    outlets: "Less than 10",
    image: "https://source.unsplash.com/800x600/?jewelry"
  },
  {
    id: "26",
    name: "ShoeStation",
    category: "Footwear",
    investment: "₹20L - 30L",
    area: "400 - 800 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?shoes"
  },
  {
    id: "27",
    name: "GrowGreen",
    category: "Agro Tech",
    investment: "₹30L - 50L",
    area: "600 - 1000 sq.ft",
    outlets: "10-20",
    image: "https://source.unsplash.com/800x600/?greenhouse"
  },
  {
    id: "28",
    name: "DryCleanX",
    category: "Laundry",
    investment: "₹5L - 15L",
    area: "300 - 600 sq.ft",
    outlets: "10-20",
    image: "https://source.unsplash.com/800x600/?laundry"
  },
  {
    id: "29",
    name: "SpeedNet",
    category: "Internet Provider",
    investment: "₹50L - 1Cr",
    area: "800 - 1000 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?internet"
  },
  {
    id: "30",
    name: "PrintBuzz",
    category: "Advertising",
    investment: "₹20L - 30L",
    area: "400 - 700 sq.ft",
    outlets: "20-50",
    image: "https://source.unsplash.com/800x600/?advertising"
  }
];

export default brands;

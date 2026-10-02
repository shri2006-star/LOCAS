// Realistic random data generator for LOCAS forms

const FIRST_NAMES = [
  "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Karan", "Meera",
  "Aditya", "Neha", "Siddharth", "Kavya", "Rajesh", "Pooja", "Amit", "Ritu",
  "Dev", "Ishita", "Tanya", "Varun", "Shruti", "Manish", "Divya", "Tarun"
];

const LAST_NAMES = [
  "Patel", "Sharma", "Deshmukh", "Iyer", "Reddy", "Kulkarni", "Malhotra", "Joshi",
  "Verma", "Sen", "Das", "Menon", "Nair", "Chawla", "Gupta", "Mehta", "Bhat", "Rao"
];

const CITIES = [
  { city: "Mumbai", state: "Maharashtra", pincode: "400050", areas: ["Bandra West", "Powai", "Thane West", "Andheri East"] },
  { city: "Bengaluru", state: "Karnataka", pincode: "560034", areas: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield"] },
  { city: "Delhi", state: "Delhi", pincode: "110001", areas: ["Connaught Place", "Dwarka", "Vasant Kunj", "Rohini"] },
  { city: "Pune", state: "Maharashtra", pincode: "411007", areas: ["Baner", "Kothrud", "Aundh", "Viman Nagar"] },
  { city: "Hyderabad", state: "Telangana", pincode: "500081", areas: ["HITEC City", "Gachibowli", "Jubilee Hills", "Kondapur"] },
];

const PURPOSES = [
  "Purchase of 2BHK Residential Flat in Prime Location",
  "Home Expansion, Interior Renovation & Solar Setup",
  "Working Capital Expansion & MSME Equipment Purchase",
  "Higher Education & International University Tuition Fees",
  "Purchase of Commercial Office Space & Inventory Refurbishment"
];

export const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateUniquePan = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const p1 = Array.from({ length: 5 }, () => getRandomItem(letters)).join("");
  const digits = String(getRandomNumber(1000, 9999));
  const p2 = getRandomItem(letters);
  return `${p1}${digits}${p2}`;
};

export const generateUniqueAadhaar = () => {
  return String(getRandomNumber(200000000000, 999999999999));
};

export const generateUniqueMobile = () => {
  const prefix = getRandomItem(["98", "99", "97", "96", "95", "93", "88", "87"]);
  const rest = String(getRandomNumber(10000000, 99999999));
  return `${prefix}${rest}`;
};

export const generateRandomPerson = () => {
  const firstName = getRandomItem(FIRST_NAMES);
  const lastName = getRandomItem(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const num = getRandomNumber(1000, 9999);
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${num}`;
  const domains = ["gmail.com", "outlook.com", "yahoo.in", "hotmail.com"];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${num}@${getRandomItem(domains)}`;
  const cityObj = getRandomItem(CITIES);
  const area = getRandomItem(cityObj.areas);
  const address = `Flat ${getRandomNumber(101, 1202)}, ${area}, ${cityObj.city}, ${cityObj.state} - ${cityObj.pincode}`;

  return {
    fullName,
    firstName,
    lastName,
    username,
    email,
    panNumber: generateUniquePan(),
    aadhaarNumber: generateUniqueAadhaar(),
    mobileNumber: generateUniqueMobile(),
    address,
  };
};

export const generateRandomWizardData = (initialProduct = "HOME", loggedInUser = null) => {
  const person = generateRandomPerson();

  // Synchronize full name and email with logged-in user if available
  if (loggedInUser && loggedInUser.fullName && loggedInUser.fullName !== 'Guest User') {
    person.fullName = loggedInUser.fullName;
    if (loggedInUser.email) {
      person.email = loggedInUser.email;
    }
  }

  const annualIncome = getRandomNumber(10, 45) * 100000;
  const existingEmis = getRandomNumber(5, 35) * 1000;
  const requestedAmount = getRandomNumber(15, 80) * 100000;
  const tenureMonths = getRandomItem([60, 120, 180, 240, 360]);

  return {
    ...person,
    employmentType: getRandomItem(["SALARIED", "SELF_EMPLOYED"]),
    annualIncome,
    existingEmis,
    productType: initialProduct,
    requestedAmount,
    tenureMonths,
    purpose: getRandomItem(PURPOSES),
    collateralType: "RESIDENTIAL_PROPERTY",
    collateralMarketValue: Math.round(requestedAmount * 1.4),
    collateralDescription: `2BHK Property, ${getRandomNumber(750, 1400)} sq.ft carpet area, ${person.address}`,
  };
};

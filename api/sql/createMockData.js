const mysql = require('mysql');

const bcrypt = require('bcrypt');

const mockProducts = require('./products.json');

const pwd123Hashed = bcrypt.hashSync("pwd123", 10);

require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  multipleStatements: true
});

// CREATE MOCK DATA / USERS / ROLES

let mockProduct1 = {
  name: "Posthorn Pendant",
  price: "18 180 SEK",
  description: "Posthorn, från Kalmar Werkstätten, är en minimalistisk pendellampa med en charmigt öglad arm som håller två skärmar i siden. De naturliga lampskärmarna bidrar till ett omgivande ljus i alla riktningar. I 140 år har Kalmar ägnat sig åt anrikt hantverk och progressiv design för att skapa dekorativ och funktionell belysning. Det österrikiska hantverket är elegant i geometrin och delikat i sina proportioner. Kombinationen av ärliga material, många års erfarenhet inom hantverket och modern design, ingjuter lamporna en rigorös minimalism med värme och mänsklighet.",
  material: "Polerad nickel eller mässing, skärm i silke. Svart textilsladd.",
  dimensions: "Bredd: 60 cm, Djup: 18 cm, Lamphöjd: 27,5 cm, Total höjd: max. 180 cm",
  specification: "Rekommenderad ljuskälla: 2 x E14, 40W. Ljuskälla ingår ej.",
  images: "https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000,https://artilleriet.centracdn.net/client/dynamic/images/46937_6bd28f389d-kalmar-w-posthorn-pendant-polished-brass-zoom.jpg?w=2000"
}
let mockProduct2 = {
  name: "Hallstatt Chandelier - Rosewood",
  price: "247 600 SEK",
  description: "Hallstatt, från Kalmar Werkstätten, är en stor och magnifik ljuskrona i trä. Kroppen formad som ett gallerverk håller 16 lampskärmar i siden och erbjuder en armatur i sann Werkbund-anda. I 140 år har Kalmar ägnat sig åt anrikt hantverk och progressiv design för att skapa dekorativ och funktionell belysning. Det österrikiska hantverket är elegant i geometrin och delikat i sina proportioner. Kombinationen av ärliga material, många års erfarenhet inom hantverket och modern design, ingjuter lamporna en rigorös minimalism med värme och mänsklighet.",
  material: "Rosenträ och svart brons. Lampskärm i silke med svart textilsladd.",
  dimensions: "Bredd: 182 cm, Djup: 125 cm, Höjd: Max. 350 cm",
  specification: "Rekommenderad ljuskälla: 16 x E27 40W. Ljuskälla igår ej.",
  images: "https://artilleriet.centracdn.net/client/dynamic/images/44924_1a8d2425d2-hallstatt-pendant-rosewood-zoom.jpg?w=2000"
}
let mockProduct3 = {
  name: "Admont Chandelier - Rosewood",
  price: "143 600 SEK",
  description: "Admont är en imponerande ljuskrona formgiven av J.T. Kalmar 1930. Lampan är designad i autentiskt Wiener Werkbund manéer och utrustad med tio armar som håller varsin lampskärm i silke. Admont är ett elegant skulptural och organiskt taklampa, ett perfekt blickfång över matbordet. I 140 år har Kalmar ägnat sig åt anrikt hantverk och progressiv design för att skapa dekorativ och funktionell belysning. Det österrikiska hantverket är elegant i geometrin och delikat i sina proportioner. Kombinationen av ärliga material, många års erfarenhet inom hantverket och modern design, ingjuter lamporna en rigorös minimalism med värme och mänsklighet.",
  material: "Rosenträ och svart brons. Lampskärm i silke med svart textilsladd.",
  dimensions: "Bredd: 225 cm, Djup: 58 cm, Höjd: Max. 350 cm",
  specification: "Rekommenderad ljuskälla: 10 x E27 40W. Ljuskälla igår ej.",
  images: "https://artilleriet.centracdn.net/client/dynamic/images/44906_fea6676b9e-kalmar-admont-pendant-rosewood-2-zoom.jpg?w=2000,https://artilleriet.centracdn.net/client/dynamic/images/44906_7996fd4f8b-kalmar-admont-pendant-rosewood-zoom.jpg?w=2000,https://artilleriet.centracdn.net/client/dynamic/images/44906_f3ab5ca29c-kalmar-admont-pendant-rosewood-3-zoom.jpg?w=2000"
}

db.connect(async (err, connection) => {
  console.log('RUNNING CREATE MOCK DATA SCRIPT');
  let userAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "User", "${pwd123Hashed}");`;
  let adminAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "Admin", "${pwd123Hashed}");`;
  let superAdminAccount = `INSERT INTO Users (userId, email, password) VALUES (null, "SuperAdmin", "${pwd123Hashed}");`;

  let userRole = `INSERT INTO Roles (roleId, rolename) VALUES (1000, "User");`;
  let adminRole = `INSERT INTO Roles (roleId, rolename) VALUES (2000, "Admin");`;
  let superAdminRole = `INSERT INTO Roles (roleId, rolename) VALUES (3000, "SuperAdmin");`;

  let userWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (1, 1000);`;
  let adminWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (2, 1000);`;
  let adminWithAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (2, 2000);`;
  let superAdminWithUserRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 1000);`;
  let superAdminWithAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 2000);`;
  let superAdminWithSuperAdminRole = `INSERT INTO UsersWithRoles (userId, roleId) VALUES (3, 3000);`;

  mockProducts.forEach(async (product, index) => {
    let insertProduct = `INSERT INTO Products (productId, name, price, description, material, dimensions, specification, images) VALUES (null, "${product.name}", "${product.price}", "${product.description}", "${product.material}", "${product.dimensions}", "${product.specification}", "${product.images}");`;
    await db.query(insertProduct , (err, result) => {
      if (err) {
        console.log('ERROR ADDING MOCK PRODUCTS', err);
        process.exit(1);
      }
      console.log(`Product ${index} inserted`);
    });
  });
  
  // let products1 = `INSERT INTO Products (productId, name, price, description, material, dimensions, specification, images) VALUES (null, "${mockProduct1.name}", "${mockProduct1.price}", "${mockProduct1.description}", "${mockProduct1.material}", "${mockProduct1.dimensions}", "${mockProduct1.specification}", "${mockProduct1.images}");`;
  // let products2 = `INSERT INTO Products (productId, name, price, description, material, dimensions, specification, images) VALUES (null, "${mockProduct2.name}", "${mockProduct2.price}", "${mockProduct2.description}", "${mockProduct2.material}", "${mockProduct2.dimensions}", "${mockProduct2.specification}", "${mockProduct2.images}");`;
  // let products3 = `INSERT INTO Products (productId, name, price, description, material, dimensions, specification, images) VALUES (null, "${mockProduct3.name}", "${mockProduct3.price}", "${mockProduct3.description}", "${mockProduct3.material}", "${mockProduct3.dimensions}", "${mockProduct3.specification}", "${mockProduct3.images}");`;

  let query = userAccount + adminAccount + superAdminAccount + userRole + adminRole + superAdminRole + userWithUserRole + adminWithUserRole + adminWithAdminRole + superAdminWithUserRole + superAdminWithAdminRole + superAdminWithSuperAdminRole;
  db.query(query, async (err) => {
    if (err) {
      console.log('ERROR CREATING MOCK DATA', err);
      process.exit(1);
    }
    console.log('USERS AND PRODUCTS CREATED!');
    process.exit(0);
  });

});
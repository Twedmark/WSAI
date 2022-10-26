const mysql = require('mysql');

const bcrypt = require('bcrypt');

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

let mockProduct = {
  name: "Posthorn Pendant",
  price: "18 180Kr",
  description: "Posthorn, från Kalmar Werkstätten, är en minimalistisk pendellampa med en charmigt öglad arm som håller två skärmar i siden. De naturliga lampskärmarna bidrar till ett omgivande ljus i alla riktningar. I 140 år har Kalmar ägnat sig åt anrikt hantverk och progressiv design för att skapa dekorativ och funktionell belysning. Det österrikiska hantverket är elegant i geometrin och delikat i sina proportioner. Kombinationen av ärliga material, många års erfarenhet inom hantverket och modern design, ingjuter lamporna en rigorös minimalism med värme och mänsklighet.",
  material: "Polerad nickel eller mässing, skärm i silke. Svart textilsladd.",
  dimensions: "Bredd: 60 cm, Djup: 18 cm, Lamphöjd: 27,5 cm, Total höjd: max. 180 cm",
  specification: "Rekommenderad ljuskälla: 2 x E14, 40W. Ljuskälla ingår ej.",
  images: "https://artilleriet.centracdn.net/client/dynamic/images/46937_6bd28f389d-kalmar-w-posthorn-pendant-polished-brass-zoom.jpg?w=2000,https://artilleriet.centracdn.net/client/dynamic/images/46930_8f4198bbc3-kalmar-posthorn-pendant-nickel-3-zoom.jpg?w=2000"
}

db.connect(async (err, connection) => {
  console.log('RUNNING CREATE TABLE SCRIPT');
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
  
  let products = `INSERT INTO Products (productId, name, price, description, material, dimensions, specification, images) VALUES (null, "${mockProduct.name}", "${mockProduct.price}", "${mockProduct.description}", "${mockProduct.material}", "${mockProduct.dimensions}", "${mockProduct.specification}", "${mockProduct.images}");`;

  let query = userAccount + adminAccount + superAdminAccount + userRole + adminRole + superAdminRole + userWithUserRole + adminWithUserRole + adminWithAdminRole + superAdminWithUserRole + superAdminWithAdminRole + superAdminWithSuperAdminRole + products;
  db.query(query, async (err) => {
    if (err) {
      console.log('ERROR CREATING TABLES', err);
      process.exit(1);
    }
    console.log('USERS CREATED!');
    process.exit(0);
  });

});
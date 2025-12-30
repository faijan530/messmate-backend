require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");
const messRoutes = require("./routes/messRoutes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/messes", messRoutes);
app.use("/profile", profileRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connected");
    sequelize.sync({ alter: true });

  })
  .then(() => {
    console.log("Models synced");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB error:", err.message);
  });


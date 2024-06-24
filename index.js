// mongodb+srv://pradumgurjar2:hzHZJSIvI9uySByr@cluster0.xqolutu.mongodb.net/
// hzHZJSIvI9uySByr

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./src/Routes/route");


const port = process.env.PORT || 5000;


app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);



module.exports = router;




//===================== [ Database Connection ] ==================/

mongoose
    .connect(
        "mongodb+srv://pradumgurjar2:hzHZJSIvI9uySByr@cluster0.xqolutu.mongodb.net/"
    )
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err));

app.use("/", router);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`);
});

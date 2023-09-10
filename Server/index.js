const express = require("express");
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const HandleMongo = require("./dbConnection");

const PORT = 8001;

//Middleware Handler for appropriate Messages
const checkMethod = (allowedMethods) => {
    return (req, res, next) => {
        if (!allowedMethods.includes(req.method)) {
            res.status(405).json({ error: "Method Not Allowed" });
        } else {
            next(); 
        }
    };
};

//Pinging the Express Server
app.get("/", (req, res) => {
    res.send("Hello From Express Server");
});


//Using Middleware for Method type Checking
app.use("/addUser", checkMethod(["POST"]));
app.post("/addUser", async (req, res) => {
    try {
        const { name, cta, spoc, mobile, email } = req.body;

        // Check if the phone number already exists
        const existingUser = await HandleMongo.findOne({ Mobile: mobile });
        if (existingUser) {
            return res.status(400).json({ Message: "PhoneNo / User already exists" });
        }

        const document = {
            CreatedDate: new Date()
        };
        
        // Creating the date Time format
        const formattedDate = document.CreatedDate.toLocaleDateString("en-GB");

        const handle = new HandleMongo({
            Contact: name,
            CTA: cta,
            SPOC: spoc,
            Mobile: mobile,
            Email: email,
            CreatedDate: formattedDate
        });

        const savedData = await handle.save();
        res.status(200).json({ Message: "Record created successfully", savedRecord: savedData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});




app.use("/getClientLists", checkMethod(["GET"]));
app.get("/getClientLists", async (req, res) => {
    try {
        // Retrieve all records
        const data = await HandleMongo.find({});
        res.status(200).json({ Message: "Data retrieved successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


app.use("/updateUser/:Mobile", checkMethod(["PUT"]));
app.put("/updateUser/:Mobile", async (req, res) => {
    try {
        const { name, cta, spoc, email } = req.body;

        // Access phoneNo from the URL parameter
        const { Mobile } = req.params;

        console.log("KK-->",req.params);

        // Find all documents that match the provided phoneNo
        const filter = { Mobile: Mobile };

        const update = {
            Contact: name,
            CTA: cta,
            SPOC: spoc,
            Mobile: Mobile,
            Email: email,
        };
        
        //using updateOne instead of updateMany for it to take less time
        const result = await HandleMongo.updateOne(filter, update);

        // Check the `result.nModified` property to see if any documents were updated
        if (result.modifiedCount > 0) {
            res.status(200).json({ Message: "Records updated successfully" });
        } else {
            res.status(400).json({ Message: "No Record was Updated" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});


//Using the phoneNo in parameter resulting in saving the payload Bandwith and results in faster execution of the code
app.use("/deleteUser/:Mobile", checkMethod(["DELETE"]));
app.delete("/deleteUser/:Mobile", async (req, res) => {
    try {
        // Access phoneNo from the URL parameter
        const { Mobile } = req.params;


        // Using deleteMany Instead of deleteOne for faster execution
        const result = await HandleMongo.deleteOne({ Mobile: Mobile });

        // Check the `result.deletedCount` property to see if any documents were deleted
        if (result.deletedCount > 0) {
            res.status(200).json({ Message: "Record deleted successfully" });
        } else {
            res.status(200).json({ Message: "No Record was Deleted" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.use("/fetchUserByNumber/:Mobile", checkMethod(["GET"]));
app.get("/fetchUserByNumber/:Mobile", async (req, res) => {
    try {
        const { Mobile } = req.params;

        const filter = { Mobile: Mobile };

        const existingUser = await HandleMongo.findOne(filter);

        if (!existingUser) {
            return res.status(404).json({ Message: "User not found" });
        }
        // Return the user data if found
        res.status(200).json(existingUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});



app.listen(PORT, () => {
    console.log("Running on port", "http://localhost:" + PORT);
});

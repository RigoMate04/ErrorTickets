import Express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";



const app = Express();

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "errTickets",
    waitForConnections: true,
    password: ""
});

app.use(Express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

app.post("/registerUser", async (req, res) => {
    try {
        const body = req.body;

        //["username", "email", "password", role_id"] 

        if(Object.keys(body).length !== 4){
            throw new Error("Invalid body.");
        }

        if (!body.username || typeof body.username !== "string") {
            throw new Error("Invalid username.");
        }

        if (!body.email || typeof body.email !== "string") {
            throw new Error("Invalid email.");
        }

        if (!body.password || typeof body.password !== "string") {
            throw new Error("Invalid password.");
        }
        if (!body.role_id || typeof body.role_id !== "number") {
            throw new Error("Invalid role_id.");
        }

        const hashedPassword = await hash(body.password, 12);

        const [insertResults] = await pool.query(
            "INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?);",
            [body.username, body.email, hashedPassword, body.role_id]
        );

        if (insertResults.affectedRows !== 1) {
            throw new Error("Failed to register user");
        }

        res.status(201).json({
            "message": "User registered successfully"
        });

    } catch (error) {
        conslole.error(error);

        if(error.message.includes("Invalid")){
            res.status(400).json({
                "message": error.message
            });
        }

             if (error.message.includes("Invalid")) {
            return res.status(400).json({
                "message": error.message
            });    
        }

        if (error.message.includes("Duplicate entry")) {
            return res.status(400).json({
                "message": "Username already exists"
            });
        }

        return res.status(500).json({
            "message": "Failed to register user"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const body = req.body;

        if (Object.keys(body).length !== 2) {
            throw new Error("Invalid body");
        }

        if (!body.username || typeof (body.username) !== "string") {
            throw new Error("Invalid username");
        }

        if (!body.password || typeof (body.password) !== "string") {
            throw new Error("Invalid password");
        }

        const [user] = await pool.query("SELECT * FROM users WHERE username = ?;", [body.username]);

        if (user.length !== 1) {
            throw new Error("Invalid username or password");
        }

        if (!await compare(body.password, user[0].password)) {
            throw new Error("Invalid username or password");
        }

        const token = jwt.sign({
            _id: user[0].id}, 
            "secret");

        res.json({
            "token": token
        });

    } catch (error) {
        console.log(error);

        if (error.message.includes("Invalid username")) {
            res.status(400).json({
                "message":error.message
            });
            return;
        }

        res.status(500).json({
            "message": "Failed to login"
        });
        return;
    }
});


app.get("/manDimTickets", async (req, res) => {
    try {
       
const [result] = await pool.query(` SELECT      t.id,     t.title,     t.place,     t.description,     ul.uLevelName AS urgent,     u.username AS username,     DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') AS formatted_created_at FROM tickets t LEFT JOIN users u ON t.userid = u.id LEFT JOIN urgency_levels ul ON t.urgentid = ul.id ORDER BY t.title; `);        res.json({"tickets" : result});

    }catch (error) {
        console.log(error);

        if (error.message.includes("Unauthorized")) {
            res.status(402).json({
                "message": error.message
            });
            return;
        }

        res.status(500).json({
            "message": "Failed to get owned tickets"
        });
    }
});

app.get("/ownedTickets", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            throw new Error("Unauthorized");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Unauthorized");
        }
        const decodedToken = jwt.verify(token, "secret");

        const [result] = await pool.query("SELECT t.id, t.title, t.place, t.description, t.urgentid,u.username AS userid, DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') AS formatted_created_at FROM tickets t LEFT JOIN users u ON t.userid = u.id WHERE t.userid = ? ORDER BY title;", [decodedToken._id]);

        res.json({"tickets": result});



    }catch (error) {
        console.log(error);
         if (error.message.includes("Invalid")) {
            res.status(400).json({
                "message": error.message
            });
            return;
        }

        if (error.message.includes("Unauthorized")) {
            res.status(402).json({
                "message": error.message
            });
            return;
        }

    }});

app.get("/getusers", async (req, res) => {
    try {
        const [result] = await pool.query(
            "SELECT u.id,u.username,u.email,u.role_id,r.name AS role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.username;");

        res.json({"users": result});
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": "Failed to get users"});
    }
});

app.delete("/users/:id", async (req, res) => {
     try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            throw new Error("Unauthorized");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Unauthorized");
        }
        const decodedToken = jwt.decode(token, "secret");
        
        const userId = parseInt(req.params.id);

          if(isNaN(userId)) {
            throw new Error("Invalid user id");
        }
        
        const [result] = await pool.query("DELETE FROM users WHERE id = ?;", [userId]);

        if(result.affectedRows !== 1) {
            throw new Error("Failed to delete user");
        }

         res.json({
            "message" : "User successfully deleted"
        });

    }catch (error) {
        console.log(error);

        if (error.message.includes("Invalid")) {
            res.status(400).json({
                "message": error.message
            });
            return;
        }

        if (error.message.includes("Unauthorized")) {
            res.status(402).json({
                "message": error.message
            });
            return;
        }

        res.status(500).json({
            "message": "Failed to delete user"
        });
        return;
    }
});

app.post("/createTicket/:id", async (req, res) => {
    try{
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            throw new Error("Unauthorized");
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            throw new Error("Unauthorized");
        }

        const decodedToken = jwt.verify(token,"secret");

        const body = req.body;

        if(Object.keys(body).length !== 4){
            throw new Error("Invalid body");
        }

        if(!body.title || typeof body.title !== "string"){
            throw new Error("Invalid title");
        }
        if(!body.place || typeof body.place !== "string"){
            throw new Error("Invalid place");
        }
        if(!body.description || typeof body.description !== "string"){
            throw new Error("Invalid description");
        }
        if(!body.urgent_id || typeof body.urgent_id !== "number"){
            throw new Error("Invalid urgent_id");
        }

        const [insertTicketResult] = await pool.query("INSERT INTO tickets (title, place, description, urgentid, userid) VALUES (?,?,?,?,?);", [body.title, body.place, body.description, body.urgent_id, decodedToken._id]);

        if(insertTicketResult.affectedRows !== 1){
            throw new Error("Failed to create ticket");
        }
        res.json({
            "message": "Ticket created successfully"
        });

    } catch(error){
        console.log(error);

        if(error.message.includes("Invalid")){
            res.status(400).json({
                "message": error.message
            });
            return;
        }

        if(error.message.includes("Unauthorized")){
            res.status(402).json({
                "message": error.message
            });
            return;
        }

        res.status(500).json({
            "message": "Failed to create ticket"
        });
        return;

    }
});

app.delete("/deleteTicket/:id",async (req,res) =>{
    try{
        const authHeader = req.headers["authorization"];
        if(!authHeader){
            throw new Error("Unauthorized");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Unauthorized");
        }
        const decodedToken = jwt.verify(token, "secret");

        console.log("PARAM:", req.params.id);
        console.log("TYPE:", typeof req.params.id);

        const ticketid = parseInt(req.params.id);

        console.log(ticketid);

        if(isNaN(ticketid)){
            throw new Error("Invalid ticket id");
        }

        const [result] = await pool.query("DELETE FROM tickets WHERE id=?;", [ticketid]);

        console.log(result);

        if(result.affectedRows !== 1){
            throw new Error("Failed to delete ticket");
        }

        res.json({
            "message": "Ticket successfully deleted"
        });

    }catch(error){
        console.log(error);

        if (error.message.includes("Invalid")) {
            res.status(400).json({
                "message": error.message
            });
            return;
        }

        if (error.message.includes("Unauthorized")) {
            res.status(401).json({
                "message": error.message
            });
            return;
        }

        res.status(500).json({
            "message": "Failed to delete ticket"
        });
        return;
    }
   
});


app.post("/modifyTicket/:id", async (req, res) => {
    try {
            const body = req.body;

            if(Object.keys(body).length !== 4){
                throw new Error("Invalid body");
            }

            if(!body.title || typeof body.title !== "string"){
                throw new Error("Invalid title");
            }
            if(!body.place || typeof body.place !== "string"){
                throw new Error("Invalid place");
            }  
            if(!body.description || typeof body.description !== "string"){
                throw new Error("Invalid description");
            }
            if(!body.urgent_id || typeof body.urgent_id !== "number"){
                throw new Error("Invalid urgent_id");
            }

            const [insertTicketResult] = await pool.query("UPDATE tickets SET title=?, place=?, description=?, urgentid=? WHERE id=?;", [body.title, body.place, body.description, body.urgent_id, req.params.id]);

            if(insertTicketResult.affectedRows !== 1){
                throw new Error("Failed to modify ticket");
            }
            res.json({
                "message": "Ticket modified successfully"
            });
    }catch (error) {
          console.log(error);

        if(error.message.includes("Invalid")){
            res.status(400).json({
                "message": error.message
            });
            return;
        }

        if(error.message.includes("Unauthorized")){
            res.status(402).json({
                "message": error.message
            });
            return;
        }

        res.status(500).json({
            "message": "Failed to create ticket"
        });
        return;
    }
});

app.get("/listStaff", async (req, res) => {
        try{
            const [result] = await pool.query("SELECT id, username FROM users WHERE role_id = 3 ORDER BY username;");

            res.json({"employees": result});
        }catch(error){
            console.log(error);
            res.status(500).json({"message": "Failed to get staff"});
        }
});


app.post("/assignTicket/:ticketId", async (req, res) => {
    try {
        const body = req.body;

        if(Object.keys(body).length !==1){
            throw new Error("Invalid body.");
        }

        if(!body.employeeId || typeof body.employeeId !== "number"){
            throw new Error("Invalid employeeId");
        }

        const[insertTicketResult] = await pool.query("UPDATE tickets SET userid=? WHERE id=?;",body.employeeId,req.params.id);

         if(insertTicketResult.affectedRows !== 1){
                throw new Error("Failed to modify ticket");
            }
            res.json({
                "message": "Ticket assigned successfully"
            });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({"message": "Failed to assign ticket!"})
    }
    
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend is running on localhost ${PORT}`);
});
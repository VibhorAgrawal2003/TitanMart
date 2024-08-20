import dotenv from "dotenv";
import { getSupabase } from "../supabaseClient.js";
import multer from "multer";

// configuration
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

// Add new product if admin requests
export const addProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "File upload failed" });
        }

        try {
            const supabase = getSupabase();
            const { username, name, provider, category, cost, description } = req.body;
            let image_url = null;

            // Check admin status of username
            const { data: admin_data, error: admin_error } = await supabase
                .from("users")
                .select("admin")
                .eq("username", username)
                .single();
            if (admin_error) throw admin_error;

            if (!admin_data.admin) {
                return res.status(401).json({ error: "User must be ADMIN to add product." });
            }

            // Process the uploaded image if available
            if (req.file) {
                const { data, error: uploadError } = await supabase.storage
                    .from("items")
                    .upload(`public/${name}-${provider}-${req.file.originalname}`, req.file.buffer, {
                        contentType: req.file.mimetype,
                    });

                if (uploadError) {
                    console.error("Upload Error:", uploadError.message);
                    throw uploadError;
                }
                image_url = `${process.env.ITEM_PATH}${data.path}`;
            }

            console.log(username, name, provider, category, cost, description, image_url);

            // Add product information
            const product = {
                name,
                provider,
                category,
                cost,
                description,
                ...(image_url && { image_url }),
            };

            const { error: insertError } = await supabase.from("products").insert(product);
            if (insertError) throw insertError;

            res.status(201).json({ message: "Product added successfully" });
        } catch (error) {
            console.error("Error:", error.message);
            res.status(500).json({ error: error.message });
        }
    });
};

const clientPromise = require('./mongodb-client');

async function removeBid(req, res) {
    try {
        const data = request.data;

        const client = await clientPromise;
        const database = client.db(process.env.DB_NAME);
        const col = database.collection(process.env.COL_NAME);

        await col.deleteOne(data);
        res.status(200).json({ status : "success" });

    } catch (e) {
        res.status(400).json({ error : e.message });

    }
}

module.exports = removeBid;
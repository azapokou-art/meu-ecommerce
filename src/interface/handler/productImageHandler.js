const productImageHandler = {

    async upload(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: 'No image file provided'
                });
            }

            const imageUrl = `/uploads/products/${req.file.filename}`;

            res.json({
                message: 'Image uploaded successfully',
                imageUrl
            });

        } catch (error) {
            res.status(500).json({
                error: 'Image upload failed'
            });
        }
    }

};

module.exports = productImageHandler;

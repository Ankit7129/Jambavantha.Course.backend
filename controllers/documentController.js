const Document = require('../models/Document'); // Assume you have a Document model defined
const multer = require('multer'); // Middleware for handling file uploads
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path to store uploaded documents
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid duplicates
    },
});

const upload = multer({ storage });

// Upload a document
const uploadDocument = (req, res) => {
    upload.single('document')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading document' });
        }

        const { userID } = req.body; // Assuming you get user ID from the request body

        try {
            // Create a new document entry in the database
            const document = new Document({
                userID, // Associate document with user
                filePath: req.file.path, // Store the file path
                fileName: req.file.filename, // Store the file name
                uploadedAt: new Date(), // Store the upload date
            });

            await document.save();
            res.status(201).json({ message: 'Document uploaded successfully', document });
        } catch (error) {
            console.error('Error saving document:', error);
            res.status(500).json({ message: 'Server error while saving document' });
        }
    });
};

// Get all documents for a user
const getDocuments = async (req, res) => {
    const { userID } = req.params; // Assuming user ID is passed as a route parameter

    try {
        const documents = await Document.find({ userID });
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Server error while fetching documents' });
    }
};

// Add remarks to a document
const addRemarks = async (req, res) => {
    const { documentID } = req.params; // Assuming document ID is passed as a route parameter
    const { remarks } = req.body; // Assuming remarks are passed in the request body

    try {
        const document = await Document.findByIdAndUpdate(
            documentID,
            { remarks },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({ message: 'Remarks added successfully', document });
    } catch (error) {
        console.error('Error adding remarks:', error);
        res.status(500).json({ message: 'Server error while adding remarks' });
    }
};

// Delete a document
const deleteDocument = async (req, res) => {
    const { documentID } = req.params; // Assuming document ID is passed as a route parameter

    try {
        const document = await Document.findByIdAndDelete(documentID);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Optionally, you can delete the file from the server as well
        // fs.unlinkSync(document.filePath); // Uncomment if you want to remove the file

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Server error while deleting document' });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    addRemarks,
    deleteDocument,
};

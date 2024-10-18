const express = require('express');
const { uploadDocument, getDocuments, deleteDocument, addRemarks } = require('../controllers/documentController'); // Ensure addRemarks is imported
const router = express.Router();

// Route for uploading documents
router.post('/upload', uploadDocument);

// Route for getting user documents
router.get('/documents/:userID', getDocuments);

// Route for deleting a document
router.delete('/documents/:documentID', deleteDocument);

// Route for adding remarks to a document
router.patch('/documents/:documentID/remarks', addRemarks); // New route for adding remarks

module.exports = router;

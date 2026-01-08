import React, { useState } from 'react';
import { FileText, Folder, Upload, Download, Search, MoreVertical, File } from 'lucide-react';

const DocumentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const documents = [
    { id: 1, name: 'Contract Agreement - Tech Solutions.pdf', folder: 'Contracts', caseId: 'CAS001', size: '2.4 MB', uploadedBy: 'Dr. Michael Ochieng', date: '2025-01-05', type: 'PDF' },
    { id: 2, name: 'Property Title Deed.pdf', folder: 'Legal Documents', caseId: 'CAS002', size: '1.8 MB', uploadedBy: 'Lucy Kariuki', date: '2025-01-04', type: 'PDF' },
    { id: 3, name: 'Employment Contract Draft.docx', folder: 'Contracts', caseId: 'CAS003', size: '856 KB', uploadedBy: 'Dr. Michael Ochieng', date: '2025-01-03', type: 'DOCX' },
    { id: 4, name: 'Court Filing - Custody Case.pdf', folder: 'Court Filings', caseId: 'CAS004', size: '3.2 MB', uploadedBy: 'Lucy Kariuki', date: '2025-01-02', type: 'PDF' },
    { id: 5, name: 'Client Information Form.pdf', folder: 'Client Records', caseId: 'CLT001', size: '645 KB', uploadedBy: 'Admin', date: '2025-01-01', type: 'PDF' },
  ];

  const folders = ['all', 'Contracts', 'Legal Documents', 'Court Filings', 'Client Records', 'Correspondence'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents Management</h1>
        <p className="text-gray-600 mt-1">Organize and manage case documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Folders</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <Folder className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">24.5 GB</p>
            </div>
            <File className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <Upload className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Folders */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 ${
                selectedFolder === folder
                  ? 'bg-amber-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Folder className="h-4 w-4" />
              {folder.charAt(0).toUpperCase() + folder.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Upload */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 w-full md:w-auto">
            <Upload className="h-5 w-5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case/Client ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${
                        doc.type === 'PDF' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          doc.type === 'PDF' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Folder className="h-4 w-4 text-yellow-600" />
                      {doc.folder}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{doc.caseId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{doc.size}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{doc.uploadedBy}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{doc.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsManagement;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Check, XCircle, Mail, Users, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ParentKidLink = ({ onClose }) => {
  const { user, token } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/parent-kid/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post(
        `${API_URL}/parent-kid/request`,
        {
          targetEmail: email,
          requestedBy: user.role
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({
        type: 'success',
        text: `Link request sent successfully to ${email}!`
      });
      setEmail('');
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to send request'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await axios.post(
        `${API_URL}/parent-kid/respond/${requestId}`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({
        type: 'success',
        text: action === 'approve' ? 'Link approved!' : 'Request rejected'
      });
      fetchRequests();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to respond'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <LinkIcon className="text-white" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.role === 'kid' ? 'Link to Parent' : 'Link to Kid'}
              </h2>
              <p className="text-white/90 text-sm">
                {user.role === 'kid'
                  ? 'Connect with your parent to share your progress'
                  : 'Connect with your kid to monitor their learning'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Send Request Form */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <UserPlus size={20} />
              Send Link Request
            </h3>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {user.role === 'kid' ? "Parent's Email" : "Kid's Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </div>

          {/* Pending Requests */}
          {requests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={20} />
                Pending Requests ({requests.length})
              </h3>
              <div className="space-y-3">
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.role === 'kid' ? request.parent_name : request.kid_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user.role === 'kid' ? request.parent_email : request.kid_email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested by: {request.requested_by}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespond(request.id, 'approve')}
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                          title="Approve"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleRespond(request.id, 'reject')}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {requests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p>No pending requests</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ParentKidLink;

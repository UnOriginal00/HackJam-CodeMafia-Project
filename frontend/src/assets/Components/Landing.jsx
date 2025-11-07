import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has a JWT, send them to the app
    try {
      const jwt = localStorage.getItem('jwt');
      if (jwt) navigate('/home-page');
    } catch (e) {}
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-purple-100 to-violet-50 p-6" style={{ fontFamily: 'Krub, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between py-6 px-4 lg:px-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-orange-400 to-purple-400">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ background: 'linear-gradient(90deg, rgba(246,157,75,1) 0%, rgba(177,155,217,1) 74%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Innovation Lounge</div>
              <div className="text-xs text-gray-600">Collaborate. Create. Iterate.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login-page')}
              className="px-4 py-2 bg-white border border-gray-200 rounded-md transform transition duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-gradient-to-r from-orange-400 to-purple-400 text-white rounded-md shadow transform transition duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </header>

        {/* Main hero */}
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="px-6 lg:px-0">
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-4">Where innovation thrives</h2>
            <p className="text-lg text-gray-700 mb-6">Bring ideas to life with group collaboration, a personal AI workspace, and a single place to capture what matters.</p>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-4 bg-gradient-to-r from-orange-400 to-purple-400 text-white rounded-lg text-lg shadow-lg transform transition duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
              >
                Get started — Sign up
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-6 shadow transform transition duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="text-xl font-semibold mb-2">Collab Zone</div>
                <div className="text-sm text-gray-600 mb-3">Collaborate and let creativity take control.</div>
                <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                  <li>Group ideas and voting</li>
                  <li>Shared chat and resources</li>
                  <li>Simple group management</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow transform transition duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="text-xl font-semibold mb-2">MyDesk</div>
                <div className="text-sm text-gray-600 mb-3">Organise and assess your innovations.</div>
                <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
                  <li>Personal idea drafts</li>
                  <li>AI companion for ideation</li>
                  <li>Share ideas to groups when ready</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right visual/feature panel */}
          <div className="px-6 lg:px-0">
            <div className="bg-gradient-to-br from-purple-200 to-orange-200 rounded-2xl p-8 h-full flex flex-col justify-center shadow-lg">
              <div className="mb-4">
                <div className="text-2xl font-semibold">Features that hook</div>
                <div className="text-sm text-gray-700 mt-2">Everything you need to move from idea to action.</div>
              </div>

              <div className="mt-4 space-y-3 text-gray-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">💡</div>
                  <div>
                    <div className="font-medium">Capture quickly</div>
                    <div className="text-sm text-gray-600">Save ideas in seconds on the go.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">🤝</div>
                  <div>
                    <div className="font-medium">Collaborate</div>
                    <div className="text-sm text-gray-600">Invite teammates, discuss, and vote.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">🧠</div>
                  <div>
                    <div className="font-medium">AI companion</div>
                    <div className="text-sm text-gray-600">Get focused suggestions and summaries.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

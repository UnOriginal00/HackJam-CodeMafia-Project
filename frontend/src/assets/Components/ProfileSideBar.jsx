import React, { useContext } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from "../Icons/Profile-Side-Icon/Dashboard.svg"
import Trophy from "../Icons/Profile-Side-Icon/Trophy.svg"
import Shield from "../Icons/Profile-Side-Icon/Shield.svg"
import LogOut from "../Icons/Profile-Side-Icon/LogOut.svg"

import { AuthContext } from '../../../auth/AuthContext';

export default function ProfileSideBar(){
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const profile = auth?.user || JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};
    const email = (profile.email || profile.Email || profile.userEmail || '').toString();
    const userId = profile.userId ?? profile.id ?? profile.UserId ?? profile.UserID ?? null;

    // derive initials (same logic as SharedHeader)
    const findField = (obj, candidates) => {
        if (!obj || typeof obj !== 'object') return null;
        for (const k of candidates) if (obj[k]) return obj[k];
        for (const v of Object.values(obj)) {
            if (v && typeof v === 'object') {
                for (const k of candidates) if (v[k]) return v[k];
            }
        }
        return null;
    };

    const first = (findField(profile, ['name', 'firstName', 'fullName']) || '').toString().trim();
    const last = (findField(profile, ['surName', 'lastName']) || '').toString().trim();
    const username = (findField(profile, ['userName', 'username']) || '').toString().trim();
    const em = (findField(profile, ['email']) || '').toString().trim();

    const combined = `${first} ${last}`.trim();
    let displayName = '';
    if (combined) displayName = combined;
    else if (first) displayName = first;
    else if (username) displayName = username;
    else if (em) {
        const local = em.split('@')[0] || '';
        const words = local.replace(/[._\-]+/g, ' ').split(' ').filter(Boolean);
        displayName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    const nameParts = (combined || displayName).split(' ').filter(Boolean);
    let initials = '';
    if (nameParts.length === 0) initials = '';
    else if (nameParts.length === 1) initials = nameParts[0].charAt(0).toUpperCase();
    else initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();

    const goToDashboard = () => navigate('/dashboard');

    return (
        <div className="flex justify-end">
        <div className="bg-[#eee] w-72 rounded-md flex flex-col p-3 gap-3 max-h-72 overflow-y-auto pb-3 shadow-lg border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {initials ? (
                            <span className="text-lg">{initials}</span>
                        ) : (
                            <User className="w-7 h-7 text-white" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold truncate" title={email}>{email || 'Unknown user'}</p>
                        <p className="text-sm text-gray-600">{userId ? `ID: ${userId}` : 'ID: N/A'}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-base cursor-pointer hover:bg-gray-50 rounded-md p-2" onClick={goToDashboard}>
                        <img className="w-7 h-7" src={DashboardIcon} alt="dashboard" />
                        <span>User Dashboard</span>
                    </div>

                    <div className="flex items-center gap-3 text-base cursor-pointer hover:bg-gray-50 rounded-md p-2" onClick={() => navigate('/qa')}>
                        <img className="w-7 h-7" src={Trophy} alt="trophy" />
                        <span>QA (Test)</span>
                    </div>

                    <div className="flex items-center gap-3 text-base cursor-pointer hover:bg-gray-50 rounded-md p-2" onClick={() => navigate('/tiers')}>
                        <img className="w-7 h-7" src={Shield} alt="shield" />
                        <span>Premium</span>
                    </div>

                    <div className="flex items-center gap-3 text-base cursor-pointer hover:bg-gray-50 rounded-md p-2" onClick={() => { if (auth && auth.logout) auth.logout(); else { localStorage.removeItem('jwt'); localStorage.removeItem('jwt_profile'); window.location.href = '/'; } }}>
                        <img className="w-7 h-7" src={LogOut} alt="logout" />
                        <span className="font-medium text-base text-red-600">Log Out</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
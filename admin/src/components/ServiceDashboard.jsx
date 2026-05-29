import React, { useRef, useState, useEffect, useMemo } from 'react'
import {  serviceDashboardStyles } from '../assets/dummyStyles.js';
import { ClipboardList, Calendar, XCircle, CheckCircle,  } from "lucide-react";

// normalize the backend data that is coming from the DB
function normalizeService(doc) {
    if (!doc) return null;
    const id = doc._id || doc.id || String(Math.random()).slice(2);
    const name = doc.name || doc.title || doc.serviceName || "Untitled Service";
    const price =
    Number(doc.price ?? doc.fee ?? doc.fees ?? doc.cost ?? doc.amount) || 0;
    const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;
  // various possible stat shapes
    const totalAppointments =
    doc.totalAppointments ??
    doc.appointments?.total ??
    doc.count ??
    doc.stats?.total ??
    doc.bookings ??
    0;
    const completed =
    doc.completed ??
    doc.appointments?.completed ??
    doc.stats?.completed ??
    doc.completedAppointments ??
    0;
    const canceled =
    doc.canceled ??
    doc.appointments?.canceled ??
    doc.stats?.canceled ??
    doc.canceledAppointments ??
    0;

    return {
    id,
    name,
    price,
    image,
    totalAppointments: Number(totalAppointments) || 0,
    completed: Number(completed) || 0,
    canceled: Number(canceled) || 0,
    raw: doc,
    };
}

const API_BASE = "http://localhost:4000";

const ServiceDashboard = ({ services: servicesProp = null }) => {
        const [services, setServices] = useState(
    Array.isArray(servicesProp) ? servicesProp.map(normalizeService) : [],
    );
    const [loading, setLoading] = useState(!Array.isArray(servicesProp));
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [showAll, setShowAll] = useState(false);

    const mountedRef = useRef(true);
    const fetchingRef = useRef(false);
    const pollHandleRef = useRef(null);

    function buildFetchOptions() {
    const opts = {
        method: "GET",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        },
    };
    const token = localStorage.getItem("authToken");
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    return opts;
    }
    
    //fetch the service from the server side
    async function fetchServices({ showLoading = true } = {}) {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
        if (showLoading) {
        setLoading(true);
        setError(null);
        }

        const url = `${API_BASE}/api/service-appointments/stats/summary`;
        const res = await fetch(url, buildFetchOptions());
        if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
            body?.message || `Failed to fetch services (${res.status})`,
        );
        }
        const body = await res.json();

        let list = [];
        if (Array.isArray(body)) list = body;
        else if (Array.isArray(body.services)) list = body.services;
        else if (Array.isArray(body.data)) list = body.data;
        else if (Array.isArray(body.items)) list = body.items;
        else {
        const maybeArray = Object.values(body).find((v) => Array.isArray(v));
        if (maybeArray) list = maybeArray;
        }

        const normalized = (list || []).map(normalizeService).filter(Boolean);
        if (mountedRef.current) {
        setServices(normalized);
        setError(null);
        }
    } catch (err) {
        console.error("Service fetch error:", err);
        if (mountedRef.current) {
        setError(err.message || "Failed to load services");

        }
    } finally {
        if (mountedRef.current && showLoading) setLoading(false);
        fetchingRef.current = false;
    }
    }

    useEffect(() => {
    window.refreshServices = () => fetchServices({ showLoading: true });
    return () => {
        try {
        delete window.refreshServices;
        } catch {}
    };
    }, []); //global helper to refresh the page and fetch the services again

    //makes sure that the services are present

    useEffect(() => {
    mountedRef.current = true;
    if (Array.isArray(servicesProp)) {
        setServices(servicesProp.map(normalizeService));
        setLoading(false);
        return () => {
        mountedRef.current = false;
        };
    }

    //a polling while tab is visible
    fetchServices({ showLoading: true });
    function startPolling() {
        if (pollHandleRef.current) return;
        pollHandleRef.current = setInterval(() => {
        if (document.visibilityState === "visible")
            fetchServices({ showLoading: false });
        }, 10000);
    }

    function stopPolling() {
        if (pollHandleRef.current) {
        clearInterval(pollHandleRef.current);
        pollHandleRef.current = null;
        }
    }

    startPolling();

    //refresh the onFocus

    function onFocus() {
        fetchServices({ showLoading: false });
    }
    window.addEventListener("focus", onFocus);

    function onServicesUpdated() {
        fetchServices({ showLoading: false });
    }
    window.addEventListener("services:updated", onServicesUpdated);

    //refresh the local storage
    function onStorage(e) {
        if (e?.key === "service_bookings_updated") {
        fetchServices({ showLoading: false });
        }
    }
    window.addEventListener("storage", onStorage);

    // refresh the tab when becomes visible
    function onVisibilityChange() {
        if (document.visibilityState === "visible") {
        fetchServices({ showLoading: false });
        }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
        mountedRef.current = false;
        stopPolling();
        window.removeEventListener("focus", onFocus);
        window.removeEventListener("services:updated", onServicesUpdated);
        window.removeEventListener("storage", onStorage);
        document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    }, [servicesProp]);

    //filtering = searching
    const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return services;
    const qNum = Number(q);
    return services.filter((s) => {
        if (s.name.toLowerCase().includes(q)) return true;
        if (!Number.isNaN(qNum) && s.price <= qNum) return true;
        if (s.price.toString().includes(q)) return true;
        return false;
    });
    }, [services, searchQuery]);

    const INITIAL_COUNT = 8;
    const visibleServices = showAll
    ? filteredServices
    : filteredServices.slice(0, INITIAL_COUNT);

    //show the stats
    const totals = useMemo(() => {
    return filteredServices.reduce(
        (acc, s) => {
        acc.totalServices += 1;
        acc.totalAppointments += s.totalAppointments;
        acc.totalCompleted += s.completed;
        acc.totalCanceled += s.canceled;
        acc.totalEarning += s.completed * s.price;
        return acc;
        },
        {
        totalServices: 0,
        totalAppointments: 0,
        totalCompleted: 0,
        totalCanceled: 0,
        totalEarning: 0,
        },
    );
    }, [filteredServices]);

    function formatCurrency(v) {
    return `₹${Number(v || 0).toLocaleString()}`;
    }

    
    
    return (
    <div className={serviceDashboardStyles.container}>
        <div className={serviceDashboardStyles.innerContainer}>{/*Header*/}
            <div className={serviceDashboardStyles.header.container}>
                <div>
                    <h1 className={serviceDashboardStyles.header.title}>
                        Service Dashboard
                    </h1>
                    <p className={serviceDashboardStyles.header.subtitle}>
                        Overview of services, appointments and earnings
                    </p>
                </div>
                {/* refresh */}
                <div className={serviceDashboardStyles.refresh.container}>
                    <div className={serviceDashboardStyles.refresh.countText}>
                        {loading ? "Loading..." : `${filteredServices.length} service${filteredServices.length !== 1 ? "s" : ""}`}
                    </div>
                    
                    <button onClick={() => {
                        if (Array.isArray(servicesProp)) return;
                        fetchServices({showLoading: true});
                    }} className={serviceDashboardStyles.refresh.button(Array.isArray(servicesProp))}
                    title={Array.isArray(servicesProp) ? "Services provided by parent component" : "Refresh" }>
                        Refresh
                    </button>
                </div>
            </div>

            <div className={serviceDashboardStyles.statGrid}>
                    <StatCard icon={<ClipboardList size={18}/>} label= "Total Services"
                    value={totals.totalServices}/>

                    <StatCard icon={<Calendar size={18}/>} label= "Total Appointments"
                    value={totals.totalAppointments}/>

                    <StatCard icon={<span style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>KSh</span>} 
                    label="Total Earnings"
                    value={formatCurrency(totals.totalEarning)}/>

                    <StatCard icon={<CheckCircle size={18}/>} label= "Completed"
                    value={totals.totalCompleted}/>

                    <StatCard icon={<XCircle size={18}/>} label= "Cancelled"
                    value={totals.totalCancelled}/>
            </div>
        </div>
    </div>
    )
};

export default ServiceDashboard;

function StatCard({icon, label, value}) {
    return(
        <div className={serviceDashboardStyles.statCard.container}>
            <div className={serviceDashboardStyles.statCard.iconContainer}>
                {icon}
            </div>
            <div>
                <div className={serviceDashboardStyles.statCard.label}>{label}</div>
                <div className={serviceDashboardStyles.statCard.value}>{value}</div>
            </div>
        </div>
    );
}

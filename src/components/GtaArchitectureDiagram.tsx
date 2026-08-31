'use client';

import React, { useState } from 'react';
import { ShieldCheck, Activity, Zap, Server, Globe, Lock, Cpu, CheckCircle, ArrowRight, BarChart3, AlertTriangle } from 'lucide-react';

export default function GtaArchitectureDiagram() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'stages' | 'usecases'>('architecture');

  return (
    <div className="rounded-3xl p-6 sm:p-8 my-10 overflow-hidden relative" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)' }}>
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-blue)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <ShieldCheck className="w-3.5 h-3.5" /> Interactive Defense System
            </div>
            <h3 className="text-2xl font-normal tracking-tight">How Gateway Threat Authority Works</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Three-stage protection system for comprehensive multi-gigabit network defense.</p>
          </div>

          {/* Controls */}
          <div className="flex items-center p-1 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'architecture' ? 'bg-blue-600 text-white shadow-md' : 'text-muted hover:text-primary'
              }`}
            >
              Network Flow
            </button>
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'stages' ? 'bg-blue-600 text-white shadow-md' : 'text-muted hover:text-primary'
              }`}
            >
              3-Stage Process
            </button>
            <button
              onClick={() => setActiveTab('usecases')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'usecases' ? 'bg-blue-600 text-white shadow-md' : 'text-muted hover:text-primary'
              }`}
            >
              Use Cases
            </button>
          </div>
        </div>

        {/* Tab 1: Architecture Visual Diagram */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
              
              {/* Box 1: Internet & Attack Sources */}
              <div className="glass-card rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between h-full space-y-4" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Traffic Sources</h4>
                    <span className="text-xs text-muted">Public Internet</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 animate-pulse">
                    <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> DDoS Attack Stream</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20">Blocked</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500">
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Legitimate Traffic</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20">Allowed</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Edge Router */}
              <div className="glass-card rounded-2xl p-5 border flex flex-col justify-between h-full space-y-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Edge Router</h4>
                    <span className="text-xs text-muted">MikroTik / Cisco / Juniper</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Flow Telemetry & PCAP:</div>
                  <div className="px-2.5 py-1 rounded bg-blue-500/5 text-blue-400 font-mono text-[11px]">NetFlow v5 / v9</div>
                  <div className="px-2.5 py-1 rounded bg-blue-500/5 text-blue-400 font-mono text-[11px]">sFlow & IPFIX</div>
                  <div className="px-2.5 py-1 rounded bg-blue-500/5 text-blue-400 font-mono text-[11px]">Packet Capture (PCAP)</div>
                </div>
              </div>

              {/* Box 3: GTA Central Controller */}
              <div className="lg:col-span-1 glass-card rounded-2xl p-5 border relative overflow-hidden shadow-xl" style={{ borderColor: 'rgba(59, 130, 246, 0.5)', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(17, 24, 39, 0.8))' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">GTA Controller</h4>
                    <span className="text-xs text-blue-300">Threat Mitigation Engine</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/60 border border-blue-800/40">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real-Time Anomaly Alerts</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/60 border border-blue-800/40">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>BGP Blackholing & Filtering</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/60 border border-blue-800/40">
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Prometheus & Grafana SIEM</span>
                  </div>
                </div>
              </div>

              {/* Box 4: Internal Network */}
              <div className="glass-card rounded-2xl p-5 border flex flex-col justify-between h-full space-y-4" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Protected Network</h4>
                    <span className="text-xs text-muted">Zero Downtime</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-medium text-emerald-500">
                    <CheckCircle className="w-3.5 h-3.5" /> Corporate Data Center
                  </div>
                  <div className="flex items-center gap-2 font-medium text-emerald-500">
                    <CheckCircle className="w-3.5 h-3.5" /> Office Infrastructure
                  </div>
                  <div className="flex items-center gap-2 font-medium text-emerald-500">
                    <CheckCircle className="w-3.5 h-3.5" /> Web & Application Servers
                  </div>
                </div>
              </div>

            </div>

            {/* Architecture Banner */}
            <div className="p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-medium" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
              <span className="flex items-center gap-2 text-blue-400">
                <Activity className="w-4 h-4" /> GTA inspects multi-gigabit traffic flows live without causing latency or packet drops.
              </span>
              <span className="hidden sm:inline-block text-xs text-muted">Supports MikroTik RouterOS API</span>
            </div>
          </div>
        )}

        {/* Tab 2: 3-Stage Process */}
        {activeTab === 'stages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 border relative" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-lg shadow-cyan-500/30">
                1
              </div>
              <h4 className="text-lg font-bold mb-2">Traffic Analysis</h4>
              <p className="text-xs leading-relaxed text-secondary mb-4">
                Edge routers send flow data (NetFlow, sFlow, IPFIX) and packet captures (PCAP) to GTA for real-time analysis of network traffic patterns.
              </p>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-cyan-500" /> Multi-gigabit throughput</div>
                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-cyan-500" /> Zero packet drops</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border relative" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-lg shadow-amber-500/30">
                2
              </div>
              <h4 className="text-lg font-bold mb-2">DDoS Detection</h4>
              <p className="text-xs leading-relaxed text-secondary mb-4">
                Gateway Threat Controller analyzes traffic patterns, distinguishes between legitimate traffic and DDoS attacks, and triggers real-time alerts.
              </p>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-amber-500" /> Protocol anomaly scanning</div>
                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-amber-500" /> Instant operator alerts</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border relative" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h4 className="text-lg font-bold mb-2">Automated Mitigation</h4>
              <p className="text-xs leading-relaxed text-secondary mb-4">
                Implements BGP blackholing, traffic filtering, and provides threat dashboards while protecting internal networks (data centers, offices, servers).
              </p>
              <div className="space-y-1.5 text-xs text-muted">
                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-500" /> BGP Blackholing API</div>
                <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-500" /> Uninterrupted critical service</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Use Cases */}
        {activeTab === 'usecases' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5 border flex items-start gap-4" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">ISP Network Protection</h4>
                <p className="text-xs leading-relaxed text-secondary">
                  Protecting ISP networks from massive DDoS and traffic floods with automated response capabilities and edge router blackholing.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border flex items-start gap-4" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Enterprise Monitoring</h4>
                <p className="text-xs leading-relaxed text-secondary">
                  Enterprise network monitoring and anomaly detection for proactive security management and SIEM dashboard compliance.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border flex items-start gap-4" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Data Center Security</h4>
                <p className="text-xs leading-relaxed text-secondary">
                  Data center security and performance management with real-time visibility into top talkers, destinations, and traffic anomalies.
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border flex items-start gap-4" style={{ borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Automated Response</h4>
                <p className="text-xs leading-relaxed text-secondary">
                  Automated response to cyber threats for minimal downtime, business continuity, and instant Slack/Email notification dispatch.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

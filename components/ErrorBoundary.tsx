"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Box, Layers } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[460px] rounded-3xl bg-white border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
            <Box className="w-7 h-7" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-base font-black text-slate-900">
              {this.props.fallbackTitle || "3D 视口图形硬件加速受限"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {this.props.fallbackMessage ||
                "检测到当前浏览器未开启 WebGL 硬件加速或显卡资源受限。系统已为您自动隔离保护，您可以直接刷新或查看 2.5D 等轴测户型图与全景设计画廊。"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重新加载组件</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

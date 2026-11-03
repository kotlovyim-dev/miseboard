"use client";

import { Component } from "react";
import type { ReactNode } from "react";

interface WidgetErrorBoundaryProps {
  fallback: (message: string) => ReactNode;
  children: ReactNode;
}

interface WidgetErrorBoundaryState {
  message: string | null;
}

export class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  override state: WidgetErrorBoundaryState = { message: null };

  static getDerivedStateFromError(error: unknown): WidgetErrorBoundaryState {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  override componentDidUpdate(previous: WidgetErrorBoundaryProps) {
    if (this.state.message !== null && previous.children !== this.props.children) {
      this.setState({ message: null });
    }
  }

  override render() {
    const { message } = this.state;
    return message === null ? this.props.children : this.props.fallback(message);
  }
}

import { Component, type ReactNode } from 'react'
import { captureError } from '~/lib/monitoring'

type Props = { area: string; fallback: ReactNode; onError?: () => void; children: ReactNode }

/** Contains a failing subtree (e.g. the WebGL scene or a lazy chunk that failed to load). */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    captureError(error, { area: this.props.area })
    this.props.onError?.()
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

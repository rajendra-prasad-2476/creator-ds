/**
 * navigation.tsx
 *
 * Lightweight prototype navigator for the Feature Dashboard preview.
 * Screens call useNavigation() to navigate between each other without
 * needing a full router like React Router.
 *
 * Usage in a screen:
 *   const { navigate, goBack, canGoBack, params } = useNavigation()
 *   navigate("zia-provider-detail", { providerId: "openai" })
 *   goBack()
 */

import * as React from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScreenParams = Record<string, unknown>

export interface NavigationContextValue {
  navigate: (screenId: string, params?: ScreenParams) => void
  goBack: () => void
  canGoBack: boolean
  /** Params passed to the current screen from the previous navigate() call */
  params: ScreenParams
}

interface NavEntry {
  screenId: string
  params: ScreenParams
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NavigationContext = React.createContext<NavigationContextValue>({
  navigate: () => {},
  goBack: () => {},
  canGoBack: false,
  params: {},
})

export function useNavigation() {
  return React.useContext(NavigationContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NavigationProvider({
  initialScreenId,
  screenMap,
  onActiveScreenChange,
}: {
  /** The screen to show first */
  initialScreenId: string
  /**
   * Map of screenId → factory function that returns the screen component.
   * Factories receive the params passed to navigate().
   */
  screenMap: Record<string, (params: ScreenParams) => React.ReactNode>
  /** Called whenever the active screen changes (used to sync the screen-picker buttons) */
  onActiveScreenChange?: (screenId: string) => void
}) {
  const [stack, setStack] = React.useState<NavEntry[]>([
    { screenId: initialScreenId, params: {} },
  ])

  // Sync stack when the dashboard screen-picker changes
  React.useEffect(() => {
    setStack([{ screenId: initialScreenId, params: {} }])
  }, [initialScreenId])

  const current = stack[stack.length - 1]

  const value = React.useMemo<NavigationContextValue>(
    () => ({
      navigate(screenId, params = {}) {
        setStack((prev) => [...prev, { screenId, params }])
        onActiveScreenChange?.(screenId)
      },
      goBack() {
        setStack((prev) => {
          if (prev.length <= 1) return prev
          const next = prev.slice(0, -1)
          onActiveScreenChange?.(next[next.length - 1].screenId)
          return next
        })
      },
      canGoBack: stack.length > 1,
      params: current.params,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stack]
  )

  const factory = screenMap[current.screenId]

  return (
    <NavigationContext.Provider value={value}>
      {factory ? factory(current.params) : (
        <div style={{ padding: 32, color: "red" }}>
          Screen not found: {current.screenId}
        </div>
      )}
    </NavigationContext.Provider>
  )
}

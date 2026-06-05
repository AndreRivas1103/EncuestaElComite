import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSidebarClosing } from '@client/hooks/useSidebarClosing.js';

describe('useSidebarClosing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.className = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.className = '';
  });

  it('expone clase visible cuando el sidebar está abierto', () => {
    const { result } = renderHook(() =>
      useSidebarClosing(true, vi.fn(), 'hidden')
    );

    expect(result.current.sidebarClassName).toContain('visible');
    expect(result.current.sidebarClassName).toContain('sidebar');
  });

  it('aplica modificador cerrado cuando no está visible', () => {
    const { result } = renderHook(() =>
      useSidebarClosing(false, vi.fn(), 'hidden')
    );

    expect(result.current.sidebarClassName).toContain('hidden');
    expect(result.current.sidebarClassName).not.toContain('visible');
  });

  it('llama onClose tras la animación', () => {
    const onClose = vi.fn();
    const { result, rerender } = renderHook(
      ({ visible }) => useSidebarClosing(visible, onClose),
      { initialProps: { visible: true } }
    );

    act(() => {
      result.current.requestClose();
    });

    expect(result.current.closing).toBe(true);
    expect(document.body.classList.contains('sidebar-panel-closing')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(480);
    });

    expect(onClose).toHaveBeenCalledOnce();
    rerender({ visible: false });
    expect(result.current.closing).toBe(false);
  });
});

import { useState, useCallback, useMemo } from "react";

export function useLibraryCheckbox(problemIds: string[]) {
    // 内部状態は Record<string, boolean> で管理
    const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(problemIds.map(id => [id, false]))
    );

    // id がチェックされているか
    const isChecked = useCallback(
        (id: string) => !!checkedMap[id],
        [checkedMap]
    );

    // toggle する
    const toggleChecked = useCallback((id: string) => {
        setCheckedMap(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    // 全チェックかどうか
    const isAllChecked = useMemo(
        () => problemIds.every(id => checkedMap[id]),
        [checkedMap, problemIds]
    );

    // 全チェック／全解除
    const checkAll = useCallback(() => {
        const next = Object.fromEntries(problemIds.map(id => [id, true]));
        setCheckedMap(next);
    }, [problemIds]);

    const uncheckAll = useCallback(() => {
        const next = Object.fromEntries(problemIds.map(id => [id, false]));
        setCheckedMap(next);
    }, [problemIds]);

    // 外部に見せる "セット" は配列として返す
    const checkedIds = useMemo(
        () => problemIds.filter(id => checkedMap[id]),
        [checkedMap, problemIds]
    );

    return {
        checkedIds,     // 外部には配列として見せる
        isChecked,
        toggleChecked,
        isAllChecked,
        checkAll,
        uncheckAll,
    };
}

import AddIcon from "@mui/icons-material/Add"
import { Box, Button, Checkbox, Fab, IconButton, List, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from "@mui/icons-material/Close";

import type { QueryContextValue, useLibraryQueryContext } from "../../App/providers/QueryProvider"
import { AppLayout } from "../../common/AppLayout"
import LibrarySortControl from "./LibrarySortControl"
import { LibraryListItem } from "./LibraryListItem"
import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import type { LearningRecord } from "@/domain/learning/Learning";
import { useEffect } from "react";
import { LibraryCheckboxControl } from "./LibraryCheckboxControl";


export type LibraryViewHandlers = {
  view: { onViewProblem: (id: ProblemId) => void }
  import: { onImportFiles: (files: File[]) => void }
  delete: { onDeleteAll: () => void; onDeleteChecked: () => void }
  checkbox: {
    onCheckAll: () => void
    onUncheckAll: () => void
    onToggleChecked: (id: ProblemId) => void
    onToggleCheckboxMode: () => void
  }
}

export type LibrarySelection = {
  checkedIds: Set<ProblemId>
  isChecked: (id: ProblemId) => boolean
  isCheckboxMode: boolean
}

export type LibraryViewProps = {
  problems: Problem[]
  learningRecords: LearningRecord
  query: ReturnType<typeof useLibraryQueryContext>
  handlers: LibraryViewHandlers
  selection: LibrarySelection
}

/////////////////////////////////////////
export function LibraryView({
  problems,
  learningRecords,
  query,
  handlers,
  selection
}: LibraryViewProps) {

  const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")

  // ファイル選択時
  setOnFilesSelected(async files => {
    handlers.import.onImportFiles(Array.from(files))
  })

  const handleItemClick = (id: string) => {
    if (selection.isCheckboxMode) {
      handlers.checkbox.onToggleChecked(id)
    } else {
      handlers.view.onViewProblem(id)
    }
  }

  return (
    <AppLayout
      header="Library"
      fab={
        <Fab onClick={openFileDialog}>
          <AddIcon />
        </Fab>
      }
    >
      <Stack direction="row">
        <LibraryCheckboxControl
          onCheckAll={handlers.checkbox.onCheckAll}
          onUncheckAll={handlers.checkbox.onUncheckAll}
          onToggleCheckboxMode={handlers.checkbox.onToggleCheckboxMode}
          isCheckboxMode={selection.isCheckboxMode}
        />

        {selection.isCheckboxMode &&
          <IconButton
            onClick={handlers.delete.onDeleteChecked}
            disabled={selection.checkedIds.size === 0}
          >
            <DeleteIcon />
          </IconButton>
        }

        <Box sx={{ flexGrow: 1 }} />

        {/* ソート */}
        <LibrarySortControl
          sort={query.sortState}
          onSetSortKey={query.toggleSort}
          onSetSortOrder={order => query.setSortState(p => ({ ...p, order }))}
        />
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <List>
          {problems.map(p => (
            <LibraryListItem
              key={p.id}
              problem={p}
              learning={learningRecords[p.id]}
              isCheckboxMode={selection.isCheckboxMode}
              onClick={() => handleItemClick(p.id)}
              isChecked={selection.isChecked(p.id)}
              onToggleChecked={() => handlers.checkbox.onToggleChecked(p.id)}
            />
          ))}
        </List>
      </Box>

      {inputElement}
    </AppLayout>
  )
}

import DataGridActionBar from "@/shared/components/dataGrid/DataGridActionBar";
import { Opacity } from "@mui/icons-material";
import FilterList from "@mui/icons-material/FilterList";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import PrintIcon from "@mui/icons-material/Print";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import Badge from "@mui/material/Badge";

type Props = {
  onFilter: () => void;
  onFollow: () => void;
  onReview: () => void;
  onReviewNote: () => void;
  onPrint: () => void;
  onSampleOil: () => void;
  hasFilter: boolean;
  selectedCount: number;
  reviewLoading?: boolean;
  reviewNoteLoading?: boolean;
};

export default function MaintLogActions({
  onFilter,
  onFollow,
  onReview,
  onReviewNote,
  onPrint,
  onSampleOil,
  reviewLoading,
  reviewNoteLoading,
  hasFilter,
  selectedCount,
}: Props) {
  const hasSelection = selectedCount > 0;

  const actions = [
    {
      label: "Filter",
      icon: (
        <Badge color="warning" variant="dot" invisible={!hasFilter}>
          <FilterList fontSize="small" />
        </Badge>
      ),
      isEnabled: true,
      onClick: onFilter,
      disabled: false,
    },
    {
      label: "Follow",
      icon: <FollowTheSignsIcon fontSize="small" />,
      onClick: onFollow,
      disabled: selectedCount !== 1,
    },
    {
      label: reviewLoading ? "Reviewing..." : `Review (${selectedCount})`,
      icon: <RateReviewIcon fontSize="small" />,
      onClick: onReview,
      loading: reviewLoading,
      disabled: !hasSelection || reviewLoading || reviewNoteLoading,
    },
    {
      label: reviewNoteLoading
        ? "Reviewing Note..."
        : `Review Note (${selectedCount})`,
      icon: <StickyNote2Icon fontSize="small" />,
      onClick: onReviewNote,
      loading: reviewNoteLoading,
      disabled: !hasSelection || reviewLoading || reviewNoteLoading,
    },
    {
      label: `Sample Oil`,
      icon: <Opacity fontSize="small" />,
      isEnabled: true,
      onClick: onSampleOil,
      disabled: !hasSelection,
    },
    {
      label: `Print (${selectedCount})`,
      icon: <PrintIcon fontSize="small" />,
      isEnabled: true,
      onClick: onPrint,
      disabled: !hasSelection,
    },
  ];

  return <DataGridActionBar actions={actions} />;
}

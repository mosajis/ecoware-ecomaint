import { atomRig } from "@/shared/atoms/general.atom";
import { Divider } from "@mui/material";
import { useAtomValue } from "jotai";

type Props = {
  reportTitle: string;
};
export default function PrintHeader({ reportTitle }: Props) {
  const installation = useAtomValue(atomRig);
  const instName = installation?.name;

  return (
    <>
      <table className="pht">
        <tbody>
          <tr>
            <td className="cell-label">Title</td>
            <td className="cell-value" colSpan={5}>
              {reportTitle}
            </td>
          </tr>
          <tr>
            <td className="cell-label">Installation / Area</td>
            <td className="cell-value">{instName}</td>
            <td className="cell-label">System Version</td>
            <td className="cell-value">ECO Maint v.0.1.14</td>
            <td className="cell-label">Organization</td>
            <td className="cell-value">GPTK</td>
          </tr>
        </tbody>
      </table>
      <Divider />
    </>
  );
}

import { extractFullName, formatDateTime } from "@/core/helper";
import { atomUser } from "@/pages/auth/auth.atom";
import { useAtomValue } from "jotai";

export const PrintFooter = () => {
  const user = useAtomValue(atomUser);

  const userFullName = extractFullName(user?.tblEmployee);
  const dateTime = formatDateTime(new Date(), "DATETIME", true);

  return (
    <table className="pht">
      <tbody>
        <tr>
          <td className="cell-label">PrintAt</td>
          <td className="cell-value">{dateTime}</td>
          <td className="cell-label">PrintBy</td>
          <td className="cell-value">{userFullName}</td>
        </tr>
      </tbody>
    </table>
  );
};

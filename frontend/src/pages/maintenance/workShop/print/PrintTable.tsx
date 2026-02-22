import DOMPurify from "dompurify";
import { TypeTblWorkShop } from "@/core/api/generated/api";
import { formatDateTime, val } from "@/core/helper";

type Props = {
  workShop: TypeTblWorkShop;
};

export const PrintTable = ({ workShop }: Props) => {
  const sanitizedRepairDesc = DOMPurify.sanitize(
    (workShop.repairDescription as string) ?? "",
  );
  const sanitizedFollowDesc = DOMPurify.sanitize(
    (workShop.followDesc as string) ?? "",
  );

  const toolPusherFirstName =
    workShop.tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers
      ?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName;
  const toolPusherLastName =
    workShop.tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers
      ?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName;
  const toolPusherFullName = toolPusherFirstName + " " + toolPusherLastName;

  const personInCharrgeFirstName =
    workShop.tblUsersTblWorkShopPersonInChargeIdTotblUsers
      ?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName;
  const personInCharrgeLastName =
    workShop.tblUsersTblWorkShopPersonInChargeIdTotblUsers
      ?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName;
  const personInCharrgeFullName =
    personInCharrgeFirstName + " " + personInCharrgeLastName;

  const closeByFirstName =
    workShop.tblUsersTblWorkShopClosedByIdTotblUsers
      ?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.firstName;
  const closeByLastName =
    workShop.tblUsersTblWorkShopClosedByIdTotblUsers
      ?.tblEmployeeTblUsersEmployeeIdTotblEmployee?.lastName;

  const closeByFullName = closeByFirstName + " " + closeByLastName;

  // @ts-ignore
  const components = workShop.tblWorkShopComponents ?? [];
  return (
    <div className="print">
      {/* ── WorkShop Header Info ── */}
      <table className="print__box">
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>

        <tbody>
          <tr>
            <td className="print__cell print__label bg--yellow">WorkShop No</td>
            <td className="print__cell bg--yellow">
              {val(workShop.workShopNo)}
            </td>
            <td className="print__cell print__label bg--yellow">
              Awarding Date
            </td>
            <td className="print__cell bg--yellow">
              {workShop.awardingDate
                ? formatDateTime(workShop.awardingDate, "DATE", true)
                : "-"}
            </td>
          </tr>

          <tr>
            <td className="print__cell print__label">Discipline</td>
            {/* @ts-ignore */}
            <td className="print__cell">{val(workShop.tblDiscipline?.name)}</td>
            <td className="print__cell print__label">Created Date</td>
            <td className="print__cell">
              {workShop.createdDate
                ? formatDateTime(workShop.createdDate, "DATE", true)
                : "-"}
            </td>
          </tr>

          <tr>
            <td className="print__cell print__label">Person In Charge</td>
            <td className="print__cell">
              {/* @ts-ignore */}
              {val(personInCharrgeFullName)}
            </td>
            <td className="print__cell print__label">Toolpusher</td>
            <td className="print__cell">
              {/* @ts-ignore */}
              {val(toolPusherFullName)}
            </td>
          </tr>

          <tr>
            <td className="print__cell print__label">Closed Date</td>
            <td className="print__cell">
              {workShop.closedDate
                ? formatDateTime(workShop.closedDate, "DATE", true)
                : "-"}
            </td>
            <td className="print__cell print__label">Closed By</td>
            <td className="print__cell">
              {/* @ts-ignore */}
              {val(closeByFullName)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Components List ── */}
      {components.length > 0 && (
        <table className="print__box" style={{ marginTop: 8 }}>
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "23%" }} />
          </colgroup>

          <thead>
            <tr>
              <td
                className="print__cell print__label bg--yellow"
                style={{ textAlign: "center" }}
              >
                #
              </td>
              <td colSpan={2} className="print__cell print__label bg--yellow">
                Comp No
              </td>
              <td className="print__cell print__label bg--yellow">Serial No</td>
              <td className="print__cell print__label bg--yellow">Location</td>
              <td className="print__cell print__label bg--yellow">
                Model / Type
              </td>
            </tr>
          </thead>

          <tbody>
            {components.map((comp: any, index: number) => {
              const cu = comp.tblComponentUnit;
              return (
                <tr key={comp.workShopCompId}>
                  <td className="print__cell" style={{ textAlign: "center" }}>
                    {index + 1}
                  </td>
                  <td colSpan={2} className="print__cell">
                    {val(cu?.compNo)}
                  </td>
                  <td className="print__cell">{val(cu?.serialNo)}</td>
                  <td className="print__cell">
                    {val(comp.tblLocation?.name ?? cu?.tblLocation?.name)}
                  </td>
                  <td className="print__cell">{val(cu?.model)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ── Repair Description ── */}
      <table className="print__box" style={{ marginTop: 8 }}>
        <tbody>
          <tr>
            <td className="print__cell print__label">Repair Description</td>
          </tr>
          <tr>
            <td
              className="print__cell print__content"
              dangerouslySetInnerHTML={{
                __html: sanitizedRepairDesc || "-",
              }}
            />
          </tr>

          <tr>
            <td className="print__cell print__label">Follow Description</td>
          </tr>
          <tr>
            <td
              className="print__cell print__content"
              dangerouslySetInnerHTML={{
                __html: sanitizedFollowDesc || "-",
              }}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

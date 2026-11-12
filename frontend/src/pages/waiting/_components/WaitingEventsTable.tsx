import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { TypeWaitingAnalysis } from "@/core/api/api";

interface Props {
  events: TypeWaitingAnalysis["topEvents"];
}

const WaitingEventsTable = ({ events }: Props) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Phase</TableCell>
            <TableCell>NPT Class</TableCell>
            <TableCell align="right">Duration</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {events.map((event) => (
            <TableRow key={event.waitingEventId} hover>
              <TableCell>{event.eventCode ?? "-"}</TableCell>

              <TableCell>
                {new Date(event.startDateTime).toLocaleString()}
              </TableCell>

              <TableCell>
                {new Date(event.endDateTime).toLocaleString()}
              </TableCell>

              <TableCell>{event.reason?.nameEn ?? "-"}</TableCell>

              <TableCell>{event.operationPhase ?? "-"}</TableCell>

              <TableCell>{event.nptClass ?? "-"}</TableCell>

              <TableCell align="right">
                <Typography fontWeight={700}>
                  {event.durationHours.toFixed(1)} h
                </Typography>
              </TableCell>
            </TableRow>
          ))}

          {!events.length && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No waiting events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WaitingEventsTable;

import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import { Grid, Box, Typography, Button } from "@mui/material";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function MyBookingModal({
  openMybookingModal,
  handleMyBookingClose,
}) {
  const username = localStorage.getItem("username");
  const [myBookingData, setMyBookingData] = React.useState([]);

  // Fetch bookings when modal opens
  const fetchMyBooking = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/mybookings?username=${username}`);
      if (response.data !== "error") {
        setMyBookingData(response.data);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  React.useEffect(() => {
    if (openMybookingModal) {
      fetchMyBooking();
    }
  }, [openMybookingModal]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "1px solid grey",
    boxShadow: 12,
    p: 4,
  };

  const handleCancel = async (bookingId) => {
    try {
      const response = await axios.post("http://localhost:5000/cancelBooking", { // Updated URL
        bookingId,
      });
      if (response.data === "Cancelled Booking") {
        // Refresh bookings after successful cancellation
        fetchMyBooking();
      } else {
        console.error("Cancellation failed:", response.data);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <Modal
      open={openMybookingModal}
      onClose={handleMyBookingClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid item paddingBottom={4}>
          <Typography textAlign={"center"} variant="h3">
            Your Booking
          </Typography>
        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Hotel Name</StyledTableCell>
                <StyledTableCell align="right">Seats</StyledTableCell>
                <StyledTableCell align="right">Date</StyledTableCell>
                <StyledTableCell align="right">Time</StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myBookingData.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {row.selectedHotel}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.selectedSeats}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.selectedDate}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.selectedSlot}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      color="error"
                      onClick={() => handleCancel(row._id)}
                    >
                      Cancel
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
}

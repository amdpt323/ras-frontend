import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Modal, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

import DataGrid from "@components/DataGrid";
import useStore from "@store/store";
import getStudents, { Student } from "@callbacks/admin/rc/student/getStudents";
import { errorNotification } from "@callbacks/notifcation";
import EditStudent from "@components/Modals/EditStudentDetails";
import Meta from "@components/Meta";
import Enroll from "@components/Modals/Enroll";
import Freeze from "@components/Modals/Freeze";
import Unfreeze from "@components/Modals/Unfreeze";
import { getDeptProgram } from "@components/Parser/parser";
import DeleteConfirmation from "@components/Modals/DeleteConfirmation";

function DeleteStudents(props: { id: string }) {
  const { token } = useStore();
  const { id } = props;
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const handleOpenDeleteModal = () => {
    setDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };
  useEffect(() => {
    if (confirmation) {
      getStudents.deleteStudent(token, rid, id);
    }
  }, [confirmation, id, rid, token]);
  return (
    <>
      <IconButton
        onClick={() => {
          handleOpenDeleteModal();
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <DeleteConfirmation
          handleClose={handleCloseDeleteModal}
          setConfirmation={setConfirmation}
        />
      </Modal>
    </>
  );
}

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "cpi",
    headerName: "CPI",
    width: 100,
  },
  {
    field: "program_department_id",
    headerName: "Department",
    width: 100,
    valueGetter: (params) => getDeptProgram(params.value),
  },
  {
    field: "secondary_program_department_id",
    headerName: "Secondary Department",
    width: 200,
    valueGetter: (params) => getDeptProgram(params.value),
  },
  {
    field: "student_id",
    headerName: "Student ID",
    width: 100,
    hide: true,
  },
  {
    field: "is_frozen",
    headerName: "Frozen",
    width: 100,
  },
  {
    field: "type",
    headerName: "Type",
    width: 100,
  },
  {
    field: "options",
    headerName: "",
    align: "center",
    width: 100,
    hide: true,
    renderCell: (cellValues) => (
      <DeleteStudents id={cellValues.id.toString()} />
    ),
  },
  {
    field: "Actions",
    headerName: "",
    align: "center",
    width: 100,
    renderCell: (params) => (
      <Link
        href={`/admin/rc/${params.row.recruitment_cycle_id}/student/${params.row.id}`}
      >
        <Button variant="contained">View Details</Button>
      </Link>
    ),
  },
];
function Index() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any>([]);
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  const { token } = useStore();
  const [loading, setLoading] = useState(true);
  const [openEnroll, setOpenEnroll] = useState(false);
  const handleOpenEnroll = () => {
    setOpenEnroll(true);
  };
  const handleCloseEnroll = () => {
    setOpenEnroll(false);
  };

  const [openFreeze, setOpenFreeze] = useState(false);
  const handleOpenFreeze = () => {
    setOpenFreeze(true);
  };
  const handleCloseFreeze = () => {
    setOpenFreeze(false);
  };

  const [openUnFreeze, setOpenUnFreeze] = useState(false);
  const handleOpenUnFreeze = () => {
    setOpenUnFreeze(true);
  };
  const handleCloseUnFreeze = () => {
    setOpenUnFreeze(false);
  };
  useEffect(() => {
    const fetch = async () => {
      if (rid === undefined || rid === "") return;
      await getStudents
        .getAllStudents(token, rid)
        .then((res) => {
          setRows(
            res.map((student: Student) => ({
              created_at: student.CreatedAt,
              deleted_at: student.DeletedAt,
              updated_at: student.UpdatedAt,
              comment: student.comment,
              id: student.ID,
              ID: student.ID,
              name: student.name,
              email: student.email,
              cpi: student.cpi,
              program_department_id: student.program_department_id,
              secondary_program_department_id:
                student.secondary_program_department_id,
              recruitment_cycle_id: student.recruitment_cycle_id,
              student_id: student.student_id,
              is_frozen: student.is_frozen,
              type: student.type,
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          errorNotification(
            "Failed to get Students",
            err.response?.data?.message
          );
        });
    };
    fetch();
  }, [rid, token]);
  const [openNew, setOpenNew] = useState(false);
  const handleOpenNew = () => {
    setOpenNew(true);
  };
  const handleCloseNew = () => {
    setOpenNew(false);
  };
  return (
    <div className="container">
      <Meta title="Students" />
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <h2>Students</h2>
        <div>
          <IconButton onClick={handleOpenNew}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleOpenUnFreeze}>
            <HowToRegIcon />
          </IconButton>
          <IconButton onClick={handleOpenFreeze}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={handleOpenEnroll}>
            <AddIcon />
          </IconButton>
        </div>
      </Stack>
      <Modal open={openNew} onClose={handleCloseNew}>
        <EditStudent
          handleCloseNew={handleCloseNew}
          setRows={setRows}
          studentData={rows}
          rcid={rid}
        />
      </Modal>
      <Modal open={openEnroll} onClose={handleCloseEnroll}>
        <Enroll handleClose={handleCloseEnroll} />
      </Modal>
      <Modal open={openFreeze} onClose={handleCloseFreeze}>
        <Freeze handleClose={handleCloseFreeze} rid={rid} />
      </Modal>
      <Modal open={openUnFreeze} onClose={handleCloseUnFreeze}>
        <Unfreeze handleClose={handleCloseUnFreeze} rid={rid} />
      </Modal>
      <DataGrid rows={rows} columns={columns} loading={loading} />
    </div>
  );
}
Index.layout = "adminPhaseDashBoard";
export default Index;

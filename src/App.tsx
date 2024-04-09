import { Fab, Typography, Checkbox, TextField, Button } from "@mui/material";
import { Edit, Delete, Save } from "@mui/icons-material";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";

interface Task {
  id: number;
  taskText: string;
  isChecked: boolean;
}
const ListItem = ({
  task,
  isEditable,
  handleTaskCheck,
  handleTaskTextChange,
  handleDeleteClick,
}: {
  task: Task;
  isEditable: boolean;
  handleTaskCheck: (task: Task) => void;
  handleTaskTextChange: (task: Task, newText: string) => void;
  handleDeleteClick: (task: Task) => void;
}) => {
  return (
    <div id="listItem">
      {isEditable ? (
        <>
          <Checkbox
            checked={task.isChecked}
            onChange={() => handleTaskCheck(task)}
            disabled={!isEditable}
          />
          <TextField
            variant="outlined"
            size="small"
            color="secondary"
            onChange={(e) => handleTaskTextChange(task, e.target.value)}
            defaultValue={task.taskText}
            // multiline
            className="MuiInput"
            // sx={{width: 'maxContent'}}
          />
          <Delete
            onClick={() => handleDeleteClick(task)}
            color="secondary"
            sx={{ marginLeft: 1, cursor: "pointer" }}
          />
        </>
      ) : (
        <li id="listText">{task.taskText}</li>
      )}
    </div>
  );
};

const AddListItemButton = ({
  handleClick,
  isEditable,
}: {
  handleClick: () => void;
  isEditable: boolean;
}) => {
  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={!isEditable}
      color="secondary"
      sx={{marginLeft: 1.5}}
    >
      Add a new task
    </Button>
  );
};

let taskIdCount = 1;

const List = () => {
  const [isEditable, setIsEditable] = useLocalStorage("isEditable", false);
  const [tasks, setTasks] = useLocalStorage("tasks", [
    { id: 0, taskText: "", isChecked: false },
  ]);
  const sortedTasks = tasks.sort((a, b) =>
    a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1
  );

  function handleAddTaskClick() {
    setTasks([...tasks, { id: taskIdCount, taskText: "", isChecked: false }]);
    taskIdCount++;
  }

  function handleTaskCheck(task: Task) {
    const checkedTaskIndex = tasks.findIndex((t) => t.id === task.id);
    let mutateTasks = [...tasks];
    mutateTasks.splice(checkedTaskIndex, 1, {
      ...task,
      isChecked: !task.isChecked,
    });
    setTasks(mutateTasks);
  }

  function handleTaskTextChange(task: Task, newText: string) {
    const taskIndex = tasks.findIndex((t) => t.id === task.id);
    const mutateTasks = [...tasks];
    mutateTasks.splice(taskIndex, 1, { ...task, taskText: newText });
    setTasks(mutateTasks);
  }

  function handleDeleteClick(task: Task) {
    const taskIndexToDelete = tasks.findIndex((t) => t.id === task.id);
    const mutateTasks = [...tasks];
    mutateTasks.splice(taskIndexToDelete, 1);
    setTasks(mutateTasks);
  }

  return (
    <div id="list">
      <div
        className={"headerContainer"}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Typography variant="h2">My TODO List:</Typography>
        <Fab
          color="secondary"
          aria-label="edit"
          onClick={() => setIsEditable((edit) => !edit)}
          sx={{ marginLeft: 3 }}
        >
          {isEditable ? <Save /> : <Edit />}
        </Fab>
      </div>
      <div className="bodyContainer">
        {sortedTasks.map((task) => (
          <ListItem
            key={task.id}
            task={task}
            isEditable={isEditable}
            handleTaskCheck={handleTaskCheck}
            handleTaskTextChange={handleTaskTextChange}
            handleDeleteClick={handleDeleteClick}
          />
        ))}
        <AddListItemButton
          handleClick={handleAddTaskClick}
          isEditable={isEditable}
        />
      </div>
    </div>
  );
};

export default List;

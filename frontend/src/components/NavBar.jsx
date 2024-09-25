import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from "@mui/icons-material/Menu"
import GroupIcon from '@mui/icons-material/Group';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CellTowerIcon from '@mui/icons-material/CellTower';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


export default function Navbar(props) {
  const { drawerWidth, content } = props
  const location = useLocation()
  const path = location.pathname
  const [openContadores, setOpenContadores] = React.useState(false);
  const [openTareas, setOpenTareas] = React.useState(false);
  const [openInformacionContador, setOpenInformacionContador] = React.useState(false);

  const changeOpenContadoresStatus = () => {
    setOpenContadores(!openContadores);
  }

  const changeOpenTareasStatus = () => {
    setOpenTareas(!openTareas);
  }

  const changeOpenInformacionContadorStatus = () => {
    setOpenInformacionContador(!openInformacionContador);
  };

  const myDrawer = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="" selected={"" === path}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding onClick={changeOpenContadoresStatus}>
            <ListItemButton>
              <ListItemIcon>
                <CellTowerIcon />
              </ListItemIcon>
              <ListItemText primary={"Gestion Contadores"} />
              {openContadores ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openContadores} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/create" selected={"/create" === path}>
                  <ListItemIcon>
                    <ControlPointIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Dar de Alta"} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/ver-contadores" selected={"/ver-contadores" === path}>
                  <ListItemIcon>
                    <CellTowerIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Ver contadores"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          <ListItem disablePadding onClick={changeOpenTareasStatus}>
            <ListItemButton>
              <ListItemIcon>
                <AccessTimeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={"Gestion Tareas"} />
              {openTareas ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openTareas} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/programacion-lecturas" selected={"/programacion-lecturas" === path}>
                  <ListItemIcon>
                    <ControlPointIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Alta Tarea"} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/control-lecturas" selected={"/control-lecturas" === path}>
                  <ListItemIcon>
                    <AccessTimeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Mostrar Tareas"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>


        <ListItem disablePadding>
            <ListItemButton component={Link} to="/grafico" selected={"/grafico" === path}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary={"Grafico"} />
            </ListItemButton>
          </ListItem>

        </List>
      </Box>
    </div>
  );




  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={changeOpenContadoresStatus}
            sx={{ mr: 2, display: { sn: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Aplicacion
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {myDrawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={openContadores}
        onClose={changeOpenContadoresStatus}
        sx={{
          display: { xs: "block", sm: "none" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {myDrawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={openTareas}
        onClose={changeOpenTareasStatus}
        sx={{
          display: { xs: "block", sm: "none" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {myDrawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}

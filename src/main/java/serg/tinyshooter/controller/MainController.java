package serg.tinyshooter.controller;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import serg.tinyshooter.utils.classes.Rooms;
import serg.tinyshooter.utils.interfaces.Room;

import java.util.ArrayList;

/**
 * Created by jc on 26.01.18.
 */

@Controller
public class MainController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ModelAndView mainPage() {
        return new ModelAndView("index");
    }

    @RequestMapping(value = "/room/test", method = RequestMethod.GET)
    public ModelAndView testRoom() {
        return new ModelAndView("testRoom");
    }

    @RequestMapping(value = "/room/{id}", method = RequestMethod.GET)
    public ModelAndView room(@PathVariable("id") int id, HttpServletRequest request) {

        String name;

        name = (String) request.getSession().getAttribute("name");
        if (name == null) {
            return new ModelAndView("redirect:/log");
        }

        try {

            ModelAndView page = new ModelAndView("room");
            Room room = Rooms.getRoom(id);
            page.addObject("player_name", name);
            page.addObject("init_script", room.getInitScript());
            page.addObject("room_id", room.getId());
            page.addObject("biom", room.getBiom());

            return page;
        } catch (Exception e) {
            return new ModelAndView("redirect:/rooms");
        }
    }

    //TODO: ROOMS

    @RequestMapping(value = "/room/{id}/delete", method = RequestMethod.POST)
    public String delRoom(@PathVariable("id") int id) {
        Rooms.delRoom(id);
        return "redirect:/rooms";
    }

    @RequestMapping(value = "/room/add")
    public String addRoom() {
        Rooms.addRoom("desert");
        return "redirect:/rooms";
    }

    @RequestMapping(value = "/rooms")
    public ModelAndView rooms() {

        ModelAndView page = new ModelAndView("rooms");
        page.addObject("rooms", new ArrayList<>(Rooms.getRooms().keySet()));

        return page;
    }
}

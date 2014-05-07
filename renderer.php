<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * A block for showing system wide messages.
 *
 * @package    block_system_messages
 * @author     Eric Merrill <merrill@oakland.edu>
 * @copyright  2014 Oakland University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class block_system_messages_renderer extends plugin_renderer_base {

    public function init() {
        //$this->page->requires->js_init_call('M.block_system_messages.attachall');
    }

    public function message($message) {
        global $OUTPUT;

        $this->page->requires->js_init_call('M.block_system_messages.attach', array($message->id));

        $controls = $this->get_controls();
        $message = $OUTPUT->box($controls.$message->message, 'coursebox', 'block_system_message_id_'.$message->id);

        return $message;
    }

    public function get_controls() {
        global $OUTPUT;
        $controls = $OUTPUT->action_icon('', new \pix_icon('t/delete', 'Remove Message'), null, array('alt' => 'Remove Message'));
        $controls = $OUTPUT->box($controls, 'controls');

        return $controls;
    }

}
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
 * A block for showing announcements.
 *
 * @package    block_announce
 * @author     Eric Merrill <merrill@oakland.edu>
 * @copyright  2014 Oakland University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class block_announce_renderer extends plugin_renderer_base {

    public function init() {
        $this->page->requires->js_init_call('M.block_announce.attachall');
    }

    public function message($message) {
        global $OUTPUT;

        $controls = $this->get_controls();
        $messageconent = $OUTPUT->box($message->message, 'messagecontent');
        $hidden = $this->get_hidden_message();

        $params = array('idnum' => $message->id);
        $messagetxt = $OUTPUT->box($hidden.$controls.$messageconent, 'messagebox',
                'block_announce_id_'.$message->id, $params);

        return $messagetxt;
    }

    public function get_controls() {
        global $OUTPUT;

        $controls = $OUTPUT->render(new \pix_icon('t/delete', 'Remove Message', null, array('class' => 'controls')));

        return $controls;
    }

    public function get_hidden_message() {
        global $OUTPUT;

        $hidden = $OUTPUT->box('Message removed', 'hiddenmessage');

        return $hidden;
    }
}
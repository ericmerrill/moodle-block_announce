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

class block_announce extends block_base {
    public function init() {
        $this->title = get_string('pluginname', 'block_announce');
    }

    public function get_content() {
        global $OUTPUT, $DB;

        if ($this->content !== null) {
            return $this->content;
        }

        $this->content       = new stdClass;
        $this->content->text = '';
        

        

        $messages = $DB->get_records('block_announce');
        $renderer = $this->page->get_renderer('block_announce');
        $renderer->init();

        $hidden = get_user_preferences('block_announce_hidden');
        $hidden = explode(',', $hidden);

        $count = 0;
        foreach ($messages as $message) {
            //if (!in_array($message->id, $hidden)) {
                $this->content->text .= $renderer->message($message);
                $count++;
                
            //}
        }

        if ($count) {
            $this->content->text  .= $OUTPUT->box('', 'hidden', 'block_announce_hidden_box');
            $this->content->text  .= $OUTPUT->box('', 'messagebox hidden', 'block_announce_message_box', array('msgcount' => $count));
        }

        //$this->content->footer = '';

        return $this->content;
    }

    public function hide_header() {
        return true;
    }

    public function applicable_formats() {
        return array('all' => true, 'mod' => false, 'tag' => false);
    }
}

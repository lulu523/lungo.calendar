
/*
Lungo - HTML5 Cross-Device Framework
http://lungo.tapquo.com
Copyright (c) 2011-2013 Tapquo S.L. - Licensed GPLv3, Commercial

@namespace  Lungo.Sugar
@class      Calendar
@author     Ignacio Olalde Ramos <ina@tapquo.com> || @piniphone
@author     Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
*/


(function() {

  Lungo.Sugar.Calendar = (function() {
    var DAYS, MONTHS, WEEKDAYS, hide, show, _appendContainer, _bindContainerData, _bindEvents, _blocked, _calcFebruaryDays, _calendarValue, _callback, _checkTap, _config, _container, _createDay, _createRow, _element, _getDate, _getDayClassName, _getMonthDays, _getStartPosition, _goNextMonth, _goNextYear, _goPreviousMonth, _goPreviousYear, _headerRow, _openCalendar, _parseDate, _setValue, _shadow, _show, _to2Nums, _value;
    MONTHS = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
    WEEKDAYS = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");
    DAYS = "31,0,31,30,31,31,30,31,30,31,30,31".split(",");
    _shadow = void 0;
    _callback = void 0;
    _container = void 0;
    _element = void 0;
    _value = void 0;
    _calendarValue = void 0;
    _blocked = false;
    _config = {
      startDay: 1,
      format: "yyyy-mm-dd"
    };
    _show = function(event, value) {
      var validValue;
      if (event != null) {
        event.preventDefault();
      }
      _element = $$(this);
      if (!value) {
        validValue = (_element != null) && (_element.val() != null) && _element.val() !== "";
        _value = !validValue ? new Date() : _getDate(_element.val());
      } else {
        _value = _getDate(value);
      }
      _openCalendar(_value);
      return _shadow.addClass("show");
    };
    hide = function() {
      _container.attr("class", "");
      setTimeout((function() {
        return _shadow.removeClass("show");
      }), 200);
    };
    _appendContainer = function() {
      _container = $$("<div data-control=\"calendar\">\n  <div class=\"layout horizontal\">\n    <div data-layout=\"primary\">\n      <span class=\"icon caret-left\" data-action=\"previousMonth\"></span>\n      <strong data-calendar=\"month\">xxx</strong>\n      <span class=\"icon caret-right\" data-action=\"nextMonth\"></span>\n    </div>\n    <div data-layout=\"primary\">\n      <span class=\"icon caret-left\" data-action=\"previousYear\"></span>\n      <strong data-calendar=\"year\">yyy</strong>\n      <span class=\"icon caret-right\" data-action=\"nextYear\"></span>\n    </div>\n  </div>\n  <table>\n    <thead></thead>\n    <tbody></tbody>\n  </table>\n</div>");
      _headerRow();
      return $$("body").append(_container);
    };
    _headerRow = function() {
      var day, headRow, i;
      headRow = _createRow();
      i = 0;
      while (i < 7) {
        day = (_config.startDay + i) % 7;
        headRow.append(_createDay("", "", WEEKDAYS[day]));
        i++;
      }
      return _container.find("thead").append(headRow);
    };
    _bindEvents = function() {
      _container.find("[data-action=previousMonth]").bind("tap", _goPreviousMonth);
      _container.find("[data-action=nextMonth]").bind("tap", _goNextMonth);
      _container.find("[data-action=previousYear]").bind("tap", _goPreviousYear);
      _container.find("[data-action=nextYear]").bind("tap", _goNextYear);
      return $$("body").bind("tap", _checkTap);
    };
    _goPreviousMonth = function() {
      _calendarValue.setDate(_calendarValue.getDate() - 30);
      return _openCalendar(_calendarValue);
    };
    _goNextMonth = function() {
      _calendarValue.setDate(_calendarValue.getDate() + 30);
      return _openCalendar(_calendarValue);
    };
    _goPreviousYear = function() {
      _calendarValue.setDate(_calendarValue.getDate() - 365);
      return _openCalendar(_calendarValue);
    };
    _goNextYear = function() {
      _calendarValue.setDate(_calendarValue.getDate() + 365);
      return _openCalendar(_calendarValue);
    };
    _setValue = function(event) {
      var td, val;
      td = $$(event.target);
      val = _parseDate(td.attr("data-calendar-day"));
      if (val.split("-")[0] !== "") {
        event.preventDefault();
        _container.find(".today").removeClass('today');
        td.addClass("today");
        _element.val(val);
        if (_callback) {
          return _callback.call(this, val);
        } else {
          return hide();
        }
      }
    };
    _getDate = function(value) {
      var parts;
      parts = value.split(/[-\/]/);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    };
    _parseDate = function(strDate) {
      var parsed, parts;
      parsed = "";
      parts = strDate.split("-");
      parts[1] = _to2Nums(parts[1]);
      parts[2] = _to2Nums(parts[2]);
      return parts.join("-");
    };
    _to2Nums = function(n) {
      if (n.length === 1) {
        return "0" + n;
      } else {
        return n;
      }
    };
    _checkTap = function(event) {
      var ok, target;
      if (_blocked) {
        return true;
      }
      target = $$(event.target);
      if (!target.closest("[data-control=calendar], [data-type=calendar]").length) {
        ok = 1;
        return hide();
      }
    };
    _openCalendar = function(date) {
      var className, counter, currentDate, currentDay, currentRow, month, monthDays, startPos, started, tableBody, year;
      year = date.getFullYear();
      month = date.getMonth();
      _calendarValue = new Date(year, month, 15);
      _bindContainerData(_calendarValue);
      monthDays = _getMonthDays(year, month);
      startPos = _getStartPosition(new Date(year, month, 1).getDay());
      currentDay = 1;
      started = false;
      counter = 0;
      tableBody = _container.find("tbody").html("");
      currentRow = _createRow();
      while (currentDay < monthDays) {
        currentDate = new Date(year, month, currentDay);
        if (!started) {
          if (startPos === counter) {
            className = _getDayClassName(year, month, currentDay);
            currentRow.append(_createDay(year, month, currentDay, className));
            started = true;
          } else {
            currentRow.append(_createDay(year, month, "0", ["disabled"]));
          }
        } else {
          currentDay++;
          className = _getDayClassName(year, month, currentDay);
          if (counter % 7 === 0) {
            tableBody.append(currentRow);
            currentRow = _createRow();
          }
          currentRow.append(_createDay(year, month, currentDay, className));
        }
        counter++;
      }
      if (currentRow.children().length) {
        tableBody.append(currentRow);
      }
      _container.find("[data-calendar-day]").bind("tap", _setValue);
      return _container.attr("class", "show");
    };
    _getDayClassName = function(y, m, d) {
      var classes, dayValue, isSameMonth, weekDay;
      classes = [];
      dayValue = _value.getDate();
      isSameMonth = _value.getFullYear() === y && _value.getMonth() === m;
      weekDay = new Date(y, m, d).getDay();
      if (d === dayValue && isSameMonth) {
        classes.push("today");
      }
      if (weekDay === 0 || weekDay === 6) {
        classes.push("weekend");
      }
      return classes;
    };
    _bindContainerData = function(date) {
      var monthLabel, yearLabel;
      yearLabel = date.getFullYear();
      monthLabel = MONTHS[date.getMonth()];
      _container.find("[data-calendar=month]").html(monthLabel);
      return _container.find("[data-calendar=year]").html(yearLabel);
    };
    _createRow = function() {
      return $$("<tr>");
    };
    _createDay = function(year, month, day, className) {
      var el;
      if (className == null) {
        className = [];
      }
      el = $$("<td data-calendar-day=\"" + year + "-" + (month + 1) + "-" + day + "\">");
      return el.html(day).attr("class", className.join(" "));
    };
    _getStartPosition = function(weekday) {
      var pos;
      pos = weekday - _config.startDay;
      if (pos < 0) {
        return pos + 7;
      } else {
        return pos;
      }
    };
    _getMonthDays = function(y, m) {
      if (m === 1) {
        return _calcFebruaryDays(y);
      } else {
        return DAYS[m];
      }
    };
    _calcFebruaryDays = function(y) {
      var isLeapYear;
      isLeapYear = false;
      if (y % 4 === 0) {
        if (y % 400 === 0) {
          isLeapYear = true;
        } else if (y % 100 === 0) {
          isLeapYear = false;
        } else {
          isLeapYear = true;
        }
      }
      if (isLeapYear) {
        return 29;
      } else {
        return 28;
      }
    };
    show = function(date, callback) {
      _callback = callback;
      _blocked = true;
      setTimeout((function() {
        return _blocked = false;
      }), 100);
      return _show(null, date);
    };
    $$(function() {
      _appendContainer();
      _bindEvents();
      _shadow = $$(".notification");
      return $$("input[data-type=calendar]").attr("readonly", "true").bind("tap", function(event) {
        _callback = void 0;
        return _show.call(this, event);
      });
    });
    return {
      show: show,
      hide: hide
    };
  })();

}).call(this);

        $(document).ready(function() {
            function dateTime() {
                var format = "";
                var ndate = new Date();
                var hr = ndate.getHours();
                var h = hr % 12;

                if (hr < 12) {
                    greet = 'Good morning...';
                    format = 'AM';
                } else if (hr >= 12 && hr <= 17) {
                    greet = 'Good afternoon...';
                    format = 'PM';
                } else if (hr >= 17 && hr <= 24)
                    greet = 'Good evening...';
            }

            setInterval(dateTime, 1000);
            
            });

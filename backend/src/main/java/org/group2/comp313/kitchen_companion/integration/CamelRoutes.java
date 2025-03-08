package org.group2.comp313.kitchen_companion.integration;

import org.apache.camel.builder.RouteBuilder;
import org.group2.comp313.kitchen_companion.service.UserInteractionEventsService;
import org.springframework.stereotype.Component;

@Component
public class CamelRoutes extends RouteBuilder {

    @Override
    public void configure() throws Exception {

        from("quartz://monthlySchedule?cron=0+0+22+1+*+?")
                .log("Monthly Job Schedule to clear user interaction events")
                .bean(UserInteractionEventsService.class, "clearUserInteractionEventTable");

        from("direct:userInteractionEvents")
                .log("User Interaction Events: ${body}")
                .bean(UserInteractionEventsService.class, "createUserInteractionEvent");
    }

}
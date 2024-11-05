package com.successkoach.UCchances;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;

@SpringBootApplication
public class Application {

	private static final Logger log = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application.class);

        // Read the PORT environment variable
        String port = System.getenv("PORT");
        if (port == null || port.isEmpty()) {
            port = "8080"; // Default port for local development
        }

        // Set the server port
        app.setDefaultProperties(Collections.singletonMap("server.port", port));

        app.run(args);
    }

	@Controller
	public class CustomErrorController implements ErrorController {

		@RequestMapping("/error")
		@ResponseBody
		public String handleError() {
			// You can log the error or return a custom error message
			log.error("An error occurred");
			return "yaaaaaay error sdifjhasoig";
		}

	}
}
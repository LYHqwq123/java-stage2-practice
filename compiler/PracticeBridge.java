package practice;

import java.io.*;
import java.lang.reflect.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/** Runs actual OpenJDK javac and bytecode. No source-code interpretation. */
public final class PracticeBridge {
    private static int counter;
    private static final int OUTPUT_LIMIT = 262144;

    public static synchronized String compileAndRun(String source, String input,
                                                     String className, String fileName) {
        StringWriter diagnostics = new StringWriter();
        LimitedOutputStream stdout = new LimitedOutputStream();
        LimitedOutputStream stderr = new LimitedOutputStream();
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        PrintStream originalErr = System.err;
        URLClassLoader loader = null;
        ThreadGroup group = null;
        File directory = null;
        int compileExit = -1;
        String error = "";
        boolean timedOut = false;
        long started = System.currentTimeMillis();
        try {
            Locale.setDefault(Locale.US);
            directory = new File(System.getProperty("practice.directory", "/files"), "practice-run-" + System.currentTimeMillis() + "-" + (++counter));
            if (!directory.mkdirs()) throw new IOException("Cannot create run directory");
            File sourceFile = new File(directory, fileName);
            try (Writer writer = new OutputStreamWriter(new FileOutputStream(sourceFile), StandardCharsets.UTF_8)) {
                writer.write(source);
            }
            Class<?> javac = Class.forName("com.sun.tools.javac.Main");
            Method compile = javac.getMethod("compile", String[].class, PrintWriter.class);
            String[] options = {"-encoding", "UTF-8", "-source", "8", "-target", "8",
                "-Xlint:none", "-g", "-d", directory.getPath(), sourceFile.getPath()};
            compileExit = ((Integer) compile.invoke(null, options, new PrintWriter(diagnostics))).intValue();
            if (compileExit == 0) {
                System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
                System.setOut(new PrintStream(stdout, true, "UTF-8"));
                System.setErr(new PrintStream(stderr, true, "UTF-8"));
                loader = new URLClassLoader(new URL[] {directory.toURI().toURL()}, PracticeBridge.class.getClassLoader());
                final ClassLoader userLoader = loader;
                final String entryClass = className;
                final Throwable[] failure = new Throwable[1];
                group = new ThreadGroup("practice-" + counter);
                Thread runner = new Thread(group, new Runnable() {
                    public void run() {
                        try {
                            Class<?> mainClass = Class.forName(entryClass, true, userLoader);
                            Method main = mainClass.getDeclaredMethod("main", String[].class);
                            main.setAccessible(true);
                            main.invoke(null, (Object) new String[0]);
                        }
                        catch (InvocationTargetException e) { failure[0] = e.getCause(); }
                        catch (Throwable e) { failure[0] = e; }
                    }
                });
                runner.start();
                runner.join(6000);
                if (runner.isAlive()) {
                    timedOut = true;
                    error = "运行超过 6 秒，已停止。请检查循环条件。";
                } else if (failure[0] != null) {
                    StringWriter trace = new StringWriter();
                    failure[0].printStackTrace(new PrintWriter(trace));
                    error = trace.toString();
                }
            }
        } catch (Throwable e) {
            Throwable cause = e instanceof InvocationTargetException ? ((InvocationTargetException) e).getCause() : e;
            StringWriter trace = new StringWriter();
            cause.printStackTrace(new PrintWriter(trace));
            error = trace.toString();
        } finally {
            // This dedicated educational JVM owns all user-code threads. Each run is isolated.
            if (group != null) {
                try { group.stop(); } catch (Throwable ignored) { }
            }
            System.setIn(originalIn);
            System.setOut(originalOut);
            System.setErr(originalErr);
            if (loader != null) try { loader.close(); } catch (IOException ignored) { }
            remove(directory);
        }
        return "{\"compileExit\":" + compileExit + ",\"diagnostics\":" + quote(diagnostics.toString())
            + ",\"stdout\":" + quote(stdout.toString()) + ",\"stderr\":" + quote(stderr.toString())
            + ",\"error\":" + quote(error) + ",\"timedOut\":" + timedOut
            + ",\"durationMs\":" + (System.currentTimeMillis() - started) + "}";
    }

    private static void remove(File file) {
        if (file == null) return;
        File[] children = file.listFiles();
        if (children != null) for (File child : children) remove(child);
        file.delete();
    }

    private static String quote(String value) {
        StringBuilder out = new StringBuilder("\"");
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if (c == '\\' || c == '"') out.append('\\').append(c);
            else if (c == '\n') out.append("\\n");
            else if (c == '\r') out.append("\\r");
            else if (c == '\t') out.append("\\t");
            else if (c < 32) out.append(String.format("\\u%04x", (int) c));
            else out.append(c);
        }
        return out.append('"').toString();
    }

    private static final class LimitedOutputStream extends OutputStream {
        private final ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        public synchronized void write(int value) {
            if (buffer.size() >= OUTPUT_LIMIT) throw new IllegalStateException("输出超过 256 KB，请检查循环。");
            buffer.write(value);
        }
        public synchronized String toString() {
            try { return buffer.toString("UTF-8"); }
            catch (UnsupportedEncodingException impossible) { return buffer.toString(); }
        }
    }
}
